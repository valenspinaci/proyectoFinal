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

    async update(elem, id) {
        const productos = await this.getAll();
        const index = productos.findIndex(producto => producto.id == id);
        if (index < 0) {
            return `Error al actualizar: no se encontró el id ${id}`
        } else {
            productos[index] = { ...elem, id }
            try {
                await fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2))
            } catch (error) {
                return `Error al borrar: ${error}`
            }
        }
    }
}

module.exports = Contenedor;