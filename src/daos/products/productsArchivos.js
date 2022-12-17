import { ContenedorArchivos } from "../../managers/ContenedorArchivos.js"

class ProductsDAOArchivos extends ContenedorArchivos{
    constructor(filename){
        super(filename)
    }
} 

export {ProductsDAOArchivos}