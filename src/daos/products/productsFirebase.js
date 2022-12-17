import { ContenedorFirebase } from "../../managers/ContenedorFirebase.js"

class ProductsDAOFirebase extends ContenedorFirebase{
    constructor(col){
        super(col)
    }
} 

export {ProductsDAOFirebase}