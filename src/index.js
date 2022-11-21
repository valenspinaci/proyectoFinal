const fs = require("fs");
class Contenedor {
    constructor(filename){
        this.filename = filename;
    }

    async save(product){
        try {
            const productos = await this.getAll();
            if(productos.length>0){
                //Agregar producto adicional
                const lastId = productos[productos.length-1].id+1;
                product.id = lastId;
                product.timestamp = Date.now();
                productos.push(product);
                await fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2));
            } else{
                //Agregar primer producto
                product.id = 1;
                product.timestamp = Date.now();
                await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
            }
        } catch (error) {
            return "El producto no pudo ser guardado"
        }
    }

    async saveProduct(product){
        try {
            const productos = await this.getAll();
            if(productos.length>0){
                //Agregar producto adicional
                const lastId = productos[productos.length-1].id+1;
                product.timestamp = Date.now();
                product.id = lastId;
                product.codigo = `${product.timestamp}${product.title}${product.id}`
                product.stock = parseInt(Math.random()*10+1)
                productos.push(product);
                await fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2));
            } else{
                //Agregar primer producto
                product.id = 1;
                product.timpestamp = Date.now();
                product.stock = parseInt(Math.random()*10+1)
                product.codigo = `${product.timestamp}${product.title}${product.id}`
                await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
            }
        } catch (error) {
            return "El producto no pudo ser guardado"
        }
    }

    async getAll(){
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf-8");
            if(contenido.length>0){
                const contenidoParseado = await JSON.parse(contenido);
                return contenidoParseado;
            } else{
                return [];
            }
        } catch (error) {
            return "Hubo un error leyendo el archivo";
        }
    }

    async getById(id){
        try {
            const productos = await this.getAll();
            const productoEncontrado = productos.find(product => product.id == id);
            return productoEncontrado;
        } catch (error) {
            console.log("El producto no se encuentra")
        }
    }

    async deleteById(id){
        try {
            const productos = await this.getAll();
            const productosNuevos = productos.filter(product => product.id != id);
            await fs.promises.writeFile(this.filename, JSON.stringify(productosNuevos, null, 2));
        } catch (error) {
            console.log("El producto a eliminar no se pudo encontrar")
        }
    }

    async deleteAll(){
        try {
            const archivoVacio = await fs.promises.writeFile(this.filename, []);
        } catch (error) {
            console.log("No se pudieron eliminar los objetos")
        }
    }
}

module.exports = Contenedor;