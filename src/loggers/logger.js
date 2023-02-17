import  log4js  from "log4js";

//Configuracion del logger para indicar donde almacenaremos los registros
log4js.configure({
    //Definimos la salida de los datos
    appenders:{
        //Definimos tipo de salidas
        consola:{type:"console"},
        archivoErrores:{type:"file", filename:"./src/logs/errors.log"},
        //Le damos niveles a las salidas
        loggerConsola:{type:"logLevelFilter", appender:"consola", level:"info"},
        loggerErrores:{type:"logLevelFilter", appender:"archivoErrores", level:"error"}
    },
    categories:{
        default:{appenders:["loggerConsola", "loggerErrores"], level:"all"},
        production:{appenders:["loggerErrores"], level:"all"}
    }
})

export const logger = log4js.getLogger("default"); //Si el getLogger esta vacio es lo mismo que default
