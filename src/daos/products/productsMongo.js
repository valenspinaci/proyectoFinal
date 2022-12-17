import { ContenedorMongo } from "../../managers/ContenedorMongo.js"

class ProductsDAOMongo extends ContenedorMongo{
    constructor(col, schema){
        super(col, schema)
    }
} 

export {ProductsDAOMongo}