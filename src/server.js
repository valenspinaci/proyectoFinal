import express from "express";
import { Router } from "express";
import { ContenedorDAOProductos, ContenedorDAOCarts } from "./daos/index.js";
import {Server} from "socket.io";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "./models/user.js";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import __dirname from "./util.js";
import { options } from "./config/databaseConfig.js";
import { normalize, schema } from "normalizr";
import bcrypt from "bcryptjs";
import  parseArgs  from "minimist";
import { fork } from "child_process";
import cluster from "cluster";
import os from "os";
import { Contenedor } from "./index.js";
import {logger} from "./loggers/logger.js"

const argOptions = {default:{p:8080, m:"FORK"}};
const argumentos = parseArgs(process.argv.slice(2), argOptions);

const productosContenedor = ContenedorDAOProductos;
const carritosContenedor = ContenedorDAOCarts;
const messages = new Contenedor("src/DB/chat.txt")

//Pongo a funcionar router
const routerProductos = Router();
const routerCarrito = Router();

const app = express();
const PORT = process.env.PORT || argumentos.p;
const MODO = argumentos.m;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

//Middleware admin
const admin = true;

//Cookie parser
app.use(cookieParser());

//Configuracion de la sesion
app.use(session({
    store: MongoStore.create({
        mongoUrl: options.mongoDB.dbURL,
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge:600000}
}))

//Vinculacion de passport con el servidor
app.use(passport.initialize());
app.use(passport.session());

//Logica del cluster
if(MODO === "CLUSTER" && cluster.isPrimary){
    const numCpus = os.cpus().length;
    for(let i = 0; i<numCpus; i++){
        cluster.fork()
    }
    cluster.on("exit",(worker)=>{
        logger.fatal(`El proceso ${worker.process.pid} ha dejado de funcionar`);
        cluster.fork()
    })
}else{
    const server = app.listen(PORT, () => logger.info(`Servidor inicializado en el puerto ${PORT} y proceso ${process.pid}`));
    //Configurar websocket del lado del servidor
    const io = new Server(server);

    io.on("connection", async (socket) => {
    logger.info("Nuevo cliente conectado");
    //Productos
    //Cada vez que socket se conecte le envio los productos
    socket.emit("products", await productosContenedor.getAll());
    socket.on("newProduct", async (data) => {
        await productosContenedor.save(data);
        io.sockets.emit("products", await productosContenedor.getAll())
    });

    //Chat
    //Enviar los mensajes al cliente
    socket.emit("messagesChat", await normalizarMensajes());
    //Recibimos el mensaje
    socket.on("newMsg", async (data) => {
        await messages.save(data);
        //Enviamos los mensajes a todos los sockets que esten conectados.
        io.sockets.emit("messagesChat", await normalizarMensajes())
    })
})

    //Normalizacion
    const authorSchema = new schema.Entity("authors",{},{idAttribute:"email"})
    const messageSchema = new schema.Entity("messages",{
    author:authorSchema
    })

    //Esquema global
    const chatSchema = new schema.Entity("chats",{
        messages:[messageSchema]
    })

    //Aplicar normalizacion
    //Funcion que normaliza datos
    const normalizarData = (data)=>{
        const dataNormalizada = normalize({id:"chatHistory", messages:data}, chatSchema)
        return dataNormalizada;
    }
    //Funcion que normaliza mensajes
    const normalizarMensajes = async()=>{
        const messagesChat = await messages.getAll()
        const mensajesNormalizados = normalizarData(messagesChat);
        return mensajesNormalizados;
    }
}

//Config serializacion y deserializacion
passport.serializeUser((user,done)=>{
    return done(null, user.id)
})
passport.deserializeUser((id, done)=>{
    //Con id buscamos usuario en base de datos para traer info
    userModel.findById(id, (error, user)=>{
        return done(error, user)
    })
})

//Estrategia de registro
passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: "mail"
    },
    async (req, username, password,done)=>{
        const cryptoPassword = await bcrypt.hash(password,8);
        userModel.findOne({mail:username},(error, user)=>{
            if(error) return done(error, false, {message:"Hubo un error"});
            if(user) return done(error, false, {message:"El usuario ya existe"})
            const newUser = {
                mail: username,
                password: cryptoPassword,
                name:req.body.name,
                adress: req.body.adress,
                age:req.body.age,
                phone:req.body.phone,
                photo:req.body.photo
            };
            userModel.create(newUser, (error, userCreated)=>{
                if(error) return done (error, null, {message:"El usuario no pudo ser creado"})
                return done (null, userCreated)
            })
        })
    }
))

//Estrategia de ingreso
passport.use("loginStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField: "mail"
    },
    (req,username,password,done)=>{
        userModel.findOne({mail:username}, (error,user)=>{
            if(error) return done (error, false, {message: "Ha ocurrido un error"})
            if(user){
                let compare = bcrypt.compareSync( password, user.password );
                if(compare){
                    return done (null, user)
                }else{
                    return done (error, false, {message:"La contraseña es incorrecta"})
                }
            }else{
                return done (error, false, {message: "El correo no ha sido encontrado"})
            }
        })
    }
))

//Configurar servidor para indicarle que usaremos motor de plantillas
app.engine("handlebars", handlebars.engine());

//Indicar donde están las vistas
app.set("views", __dirname + "/views");

//Indicar el motor que usaré en express
app.set("view engine", "handlebars");

//ENDPOINTS PRODUCTOS
//Traer todos los productos
app.get("/", async(req,res)=>{
    if(req.session.passport){
        await res.render("home", {
            products: productosContenedor.getAll(),
            cart: carritosContenedor,
            user: req.session.passport.username
        })
    }else{
        res.redirect("/login")
    }
})

//Registro
app.get("/signup", (req,res)=>{
    if(req.session.passport){
        res.redirect("/")
    }else{
        res.render("signup")
    }
})

//Registro - Autenticacionn
app.post("/signup", passport.authenticate("signupStrategy", {
    failureRedirect: "/failSignup",
    failureMessage: true
}) ,(req,res)=>{
    const {mail} = req.body;
    req.session.passport.username = mail;
    res.redirect("/")
})

//Error registro
app.get("/failSignup", (req,res)=>{
    res.render("failSignup")
})

//Ingreso
app.get("/login", (req,res)=>{
    if(req.session.passport){
        res.redirect("/")
    }else{
        res.render("login")
    }
})

//Ingreso - Autenticacion
app.post("/login", passport.authenticate("loginStrategy", {
    failureRedirect: "/failLogin",
    failureMessage: true
}) ,(req,res)=>{
    const {mail} = req.body;
    req.session.passport.username = mail;
    res.redirect("/")
})

//Error ingreso
app.get("/failLogin", (req,res)=>{
    res.render("failLogin")
})

//Logout
app.get("/logout", (req,res)=>{
    const user = req.session.passport.username;
    req.session.destroy(error=>{
        if(error) return res.redirect("/home");
        res.render("logout", {user:user})
    })
})

//Traer producto por su id
routerProductos.get("/:id", async(req,res)=>{
    let id = req.params.id;
    res.json(await productosContenedor.getById(id));
})

//Subir un nuevo producto. Solo disponible para admin
routerProductos.post("/", async(req,res)=>{
    if(admin){
        await productosContenedor.save(req.body);
        res.json(req.body)
    }else{
        res.json(alert("No tienes permisos"))
    }
})

//Actualizar un producto. Solo disponible para admin
routerProductos.put("/:id", async(req,res)=>{
    const id = req.params.id;
    if(admin){
        await productosContenedor.deleteById(id);
        const newProduct = req.body;
        newProduct.id = id;
        await productosContenedor.save(newProduct);
        res.json({msg: "Modificado"});
    }else{
        res.send(alert("No tienes permisos"))
    }
})

//Borrar producto por su id. Solo disponible para admin
routerProductos.delete("/:id", async(req,res)=>{
    const id = req.params.id;
    if(admin){
        await productosContenedor.deleteById(id);
        res.json({msg: "Producto eliminado"});
    }else{
        res.send(alert("No tienes permisos"))
    }
})

//Endpoints carrito
//Crear carrito
routerCarrito.post("/",async(req,res)=>{
    const carrito = req.body;
    if(carritosContenedor.length == 0){
        carrito.id = 1;
    }else{
        const lastId = parseInt(carritosContenedor.length) + 1;
        carrito.id = parseInt(lastId + 1);
    }
    const accesoProductos = carrito.productos;
    accesoProductos.forEach(producto=>{
        producto.timestamp = Date.now();
        producto.stock = parseInt(Math.random()*10+1);
        producto.id = parseInt(accesoProductos.indexOf(producto) + 1);
        producto.codigo = `${producto.timestamp}${producto.title}${producto.id}`
    })
    await carritosContenedor.save(carrito);
    res.json({id : carrito.id});
})

//Borrar carrito por su id
routerCarrito.delete("/:id", async(req,res)=>{
    const id = req.params.id;
    await carritosContenedor.deleteById(id);
    res.json({msg: "Carrito eliminado"});
})

//Obtener productos de carrito por su id
routerCarrito.get("/:id/productos", async(req,res)=>{
    const id = req.params.id;
    const productosCarrito = await carritosContenedor.getById(id);
    res.json(productosCarrito);
})

//Agregar producto a carrito por id
routerCarrito.post("/:id/productos", async(req,res)=>{
    const id = req.params.id;
    let productos = await productosContenedor.getById(id);
    carritosContenedor.save({productos, id});
    res.json({msg: "El producto se agrego al carrito"})
})

//Eliminar determinado producto de determinado carrito
routerCarrito.delete('/:id/productos/:id_prod', async(req, res) => {
    const carrito = await carritosContenedor.getById(req.params.id);
    const prueba = carrito.productos;
    const index = prueba.findIndex(p => p.id == req.params.id_prod);
    if(index >= 0){
        prueba.splice(index, 1);
        await carritosContenedor.update(carrito, req.params.id)
    }
    res.end()
})

//Routers
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);