import mongoose from "mongoose";
import { options } from "../config/databaseConfig.js";

mongoose.connect(options.mongoDB.dbURL)

class ContenedorMongo{
    constructor(coleccion, esquema){
        this.mongoModel = mongoose.model(coleccion, esquema)
    }

    async save(product){
        try {
            await this.mongoModel.create(product);
            return product;
        } catch (error) {
            console.log("No se pudo guardar el producto")
        }
    }

    async getAll(){
        try {
            let productos = this.mongoModel.find();
            return productos;
        } catch (error) {
            console.log("No se pudieron traer los productos")
        }
    }

    async getById(id){
        try {
            let productos = await this.mongoModel.find();
            let producto = productos.find(pd=>pd.id == id);
            return producto;
        } catch (error) {
            console.log("No se pudo traer el producto")
        }
    }

    async deleteById(id){
        try {
            await this.mongoModel.deleteOne({_id:id});
            console.log("Producto eliminado")
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll(){
        try {
            await this.mongoModel.deleteAll();
            console.log("Productos eliminados")
        } catch (error) {
            console.log("No se pudieron eliminar los productos")
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

export {ContenedorMongo};