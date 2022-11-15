
//este fichero recoge el modelo y esquema principal "juego" y el esquema local "edicionschema, que estará contenido en 
// en modelo principal en forma de subdocumento"


const mongoose = require('mongoose');

//creamos el esquema ediciones
let edicionschema=new mongoose.Schema(
    {
        nombre:
        {
            type:String,
            required:true,
            trim:true


        },
        anyo:
        {
            type:Number,
            min:2000,
            max:new Date().getFullYear()


        }



    }
    
    
    )

//creamos el esquema juegos
let juegoschema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
       
       
       
    },
    edad: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    tipo:
    {

        type: String,
        enum: ["rol", "escape", "dados", "fichas", "cartas", "tablero"]
        


    },
    precio: {
        type: Number,
        required: true,
        min:0,

        },
    imagen:
    {
        type:String,
        trim: true


    },
    edicion:[edicionschema]
       
});
//creamos el modelo

let juego = mongoose.model('juego', juegoschema);
//exportamos el modelo
module.exports = juego;