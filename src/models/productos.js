import mongoose from "mongoose";

//Crear coleccion
const productsCollection = "productos";

//Crear esquema a cada documento
const productsSchema = new mongoose.Schema({
    title: String,
    price: Number,
    thumbnail: String,
    timestamp: String,
    stock: Number,
    codigo: String
})

export {productsCollection, productsSchema}