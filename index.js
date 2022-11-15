//el siguiente fichero recoge la aplicación principal, carga las librerías y los enrutadores



//librerias externas
const mongoose = require('mongoose');
const express = require('express');


//enrutadores:
const juegos = require(__dirname + '/routes/juegos');

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/juegos');

//servidor
let app = express();

// Carga de middleware 

app.use(express.json());

//cargar enrutadores:
app.use('/juegos', juegos);

//levantamos servidor:

app.listen(8080);


