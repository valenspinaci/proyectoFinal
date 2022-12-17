import express from "express";
import { Router } from "express";
import { ContenedorDAOProductos, ContenedorDAOCarts } from "./daos/index.js";
import { ContenedorArchivos } from "./managers/ContenedorArchivos.js";

//managers
//const productosContenedor = new ContenedorArchivos("src/files/productos.txt");
//const carritosContenedor = new ContenedorArchivos("./files/carrito.txt");
//const productosContenedor = new ContenedorFirebase ("productos");
//const carritosContenedor = new ContenedorFirebase ("carrito");
//const productosContenedor = new ContenedorMongo (productsCollection, productsSchema);
//const carritosContenedor = new ContenedorMongo (cartCollection, cartSchema);

const productosContenedor = ContenedorDAOProductos;
const carritosContenedor = ContenedorDAOCarts;

//Pongo a funcionar router
const routerProductos = Router();
const routerCarrito = Router();

const app = express();
const PORT = process.env.port || 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(PORT, ()=>console.log(`Servidor inicializado en puerto ${PORT}`));


//Middleware admin
const admin = true;

//ENDPOINTS PRODUCTOS
//Traer todos los productos
routerProductos.get("/", async(req,res)=>{
    res.json(await productosContenedor.getAll())
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