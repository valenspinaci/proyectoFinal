import admin from "firebase-admin";
import { options } from "../config/databaseConfig.js";

//Conexion a base de firebase
admin.initializeApp(
    {
        credential: admin.credential.cert(options.firebase)
    }
);

const db = admin.firestore();

console.log("Base de datos conectada")

class ContenedorFirebase{
    constructor(collectionName){
        this.coleccion = db.collection(collectionName)
    }

    async save(product){
        try {
            const doc = this.coleccion.doc();
            await doc.create(product, product.timestamp = Date.now());
        } catch (error) {
            console.log("El producto no pudo ser agregado")
        }
    }

    async getAll(){
        try {
            const snapshot = await this.coleccion.get();
            const docs = snapshot.docs;
            let products = docs.map(doc =>{
                return {
                    id : doc.id,
                    title  : doc.data().title,
                    price : doc.data().price,
                    thumbail : doc.data().thumbail,
                    timestamp: Date.now().toLocaleString(),
                    codigo : doc.data().codigo,
                    stock : doc.data().stock
                }
            })
            return products;
        } catch (error) {
            console.log("No se pudieron obtener los productos")
        }
    }

    async getById(id){
        try {
            const productos = await this.getAll();
            const producto = productos.find(doc=>doc.id == id)
            return producto;
        } catch (error) {
            console.log("No se pudo traer el producto")
        }
    }

    async deleteById(id){
        try {
            const producto = this.coleccion.doc(id);
            await producto.delete();
        } catch (error) {
            console.log("No se pudo eliminar el producto")
        }
    }

    async deleteAll(){
        try {
            let productos = await this.getAll();
            await productos.delete();
        } catch (error) {
            console.log("No se pudo eliminar la coleccion")
        }
    }

    async update(id){
        try {
            let producto = await this.getById(id);
            await producto.update(req.body);
        } catch (error) {
            console.log("No se pudo actualizar el producto")
        }
    }
}


export {ContenedorFirebase};