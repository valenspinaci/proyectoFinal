import { cartCollection, cartSchema } from "../models/carrito.js";
import { productsCollection, productsSchema } from "../models/productos.js";

let ContenedorDAOProductos;
let ContenedorDAOCarts;

let databaseType = "mongo";

if(databaseType == "archivos"){
    const {ProductsDAOArchivos} = await import ("./products/productsArchivos.js");
    const {CartsDAOArchivos} = await import ("./carts/cartsArchivos.js");
    ContenedorDAOProductos = new ProductsDAOArchivos("src/files/productos.txt");
    ContenedorDAOCarts = new CartsDAOArchivos("src/files/carrito.txt")
} else if(databaseType == "mongo"){
    const {ProductsDAOMongo} = await import ("./products/productsMongo.js");
    const {CartsDAOMongo} = await import("./carts/cartsMongo.js");
    ContenedorDAOProductos = new ProductsDAOMongo(productsCollection, productsSchema);
    ContenedorDAOCarts = new CartsDAOMongo(cartCollection, cartSchema); 
} else if(databaseType == "firebase"){
    const {ProductsDAOFirebase} = await import ("./products/productsFirebase.js");
    const {CartsDAOFirebase} = await import("./carts/cartsFirebase.js");
    ContenedorDAOProductos = new ProductsDAOFirebase("productos");
    ContenedorDAOCarts = new CartsDAOFirebase("carrito")
}

export {ContenedorDAOCarts, ContenedorDAOProductos};