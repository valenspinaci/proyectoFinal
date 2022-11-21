const express = require("express");
const { Router } = require("express");
const Contenedor = require("./index.js");

//Creo los dos nuevos contenedores
const productos = new Contenedor("./productos.txt");
const carritos = new Contenedor("./carrito.txt");

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
    res.json(await productos.getAll())
})

routerProductos.get("/:id", async(req,res)=>{
    id = req.params.id;
    res.json(await productos.getById(id));
})

routerProductos.post("/", async(req,res)=>{
    if(admin){
        await productos.save(req.body);
        res.send(req.body)
    }else{
        res.send(alert("No tienes permisos"))
    }
})

routerProductos.put("/:id", async(req,res)=>{
    const id = req.params.id;
    if(admin){
        await productos.deleteById(id);
        const newProduct = req.body;
        newProduct.id = id;
        await productos.save(newProduct);
        res.send("Modificado");
    }else{
        res.send(alert("No tienes permisos"))
    }
})

routerProductos.delete("/:id", async(req,res)=>{
    const id = req.params.id;
    if(admin){
        await productos.deleteById(id);
        res.send("Producto eliminado");
    }else{
        res.send(alert("No tienes permisos"))
    }
})

//Endpoints carrito
routerCarrito.post("/",async(req,res)=>{
    const carrito = req.body;
    if(carritos.length == 0){
        carrito.id = 1;
    }else{
        const lastId = parseInt(carritos.length) + 1;
        carrito.id = parseInt(lastId + 1);
    }
    const accesoProductos = carrito.productos;
    accesoProductos.forEach(producto=>{
        producto.timestamp = Date.now();
        producto.stock = parseInt(Math.random()*10+1);
        producto.id = parseInt(accesoProductos.indexOf(producto) + 1);
        producto.codigo = `${producto.timestamp}${producto.title}${producto.id}`
    })
    await carritos.save(carrito);
    res.json(carrito.id);
})

//routerCarrito.post("/:id/productos",async(req,res)=>{
//    const idCarrito = req.params.id;
//    const idProducto = req.body;
//    productos.getById(idProducto);
//    carritos.getById(idCarrito);
//})

routerCarrito.delete("/:id", async(req,res)=>{
    const id = req.params.id;
    await carritos.deleteById(id);
    res.send("Carrito eliminado");
})

routerCarrito.get("/:id/productos", async(req,res)=>{
    const id = req.params.id;
    const productosCarrito = await carritos.getById(id);
    res.json(productosCarrito);
})

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);