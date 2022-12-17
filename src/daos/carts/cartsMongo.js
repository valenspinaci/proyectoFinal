import { ContenedorMongo } from "../../managers/ContenedorMongo.js"

class CartsDAOMongo extends ContenedorMongo{
    constructor(col, schema){
        super(col, schema)
    }
} 

export {CartsDAOMongo}