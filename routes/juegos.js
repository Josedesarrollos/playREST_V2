//este fichero engloba los servicios dados por el grupo de rutas englobado en /juegos

const express = require("express");
let juego = require("../models/juego.js");
let router = express.Router();

//ruta que arroja todas los juegos

router.get("/", (req, res) => {
  juego
    .find()
    .then((resultado) => {
      res.status(200).send({ ok: true, resultado: resultado });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ ok: false, error: "No se encontraron juegos de mesa" });
    });
});



//ruta que accede a un juego por id
router.get("/:id", (req, res) => {
  juego
    .findById(req.params.id)
    .then((resultado) => {
      if (resultado) res.status(200).send({ ok: true, resultado: resultado });
      else res.status(400).send({ ok: false, error: "Juego no encontrado" });
    })
    .catch((error) => {
      res.status(400).send({ ok: false, error: "Error buscando el juego" });
    });
});


//ruta que modifica un juego por post
router.post("/", (req, res) => {
  let nuevoJuego = new juego({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    tipo: req.body.tipo,
    precio: req.body.precio,
    imagen: req.body.imagen,
    edicion: {
      nombre: req.body.edicion.nombre,
      anyo: req.body.edicion.anyo,
    },
  });
  nuevoJuego
    .save()
    .then((resultado) => {
      res.status(200).send({ ok: true, resultado: resultado });
    })
    .catch((error) => {
      res.status(400).send({ ok: false, error: "Error insertando el juego" });
    });
});

//ruta que modifica un juego
router.put("/:id", (req, res) => {
  juego
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          edad: req.body.edad,
          tipo: req.body.tipo,
          precio: req.body.precio,
          imagen: req.body.imagen,
        },
      },
      { new: true }
    )
    .then((resultado) => {
      if (resultado) res.status(200).send({ ok: true, resultado: resultado });
      else res.status(400).send({ ok: false, error: "juego no encontrado" });
    })
    .catch((error) => {
      res.status(400).send({ ok: false, error: "Error modificando el juego" });
    });
});


//ruta que añade, por post, una nueva edición del juego
router.post("/ediciones/:id", (req, res) => {
  //buscamos el juego mediante el id  
  juego
    .findById(req.params.id)
    .then((resultados) => {
     if((req.body.anyo<=new Date().getFullYear())&&(req.body.anyo>=2000))
     { 
      //si el año es correcto, entonces insertamos en el array edición, la edición que recibimos en el body
      resultados.edicion.push(

        {
          
            nombre:req.body.nombre,
            anyo: req.body.anyo
          


        }
      )
      //tras insertarlo en el objeto recibido, igualamos el valor del array edición del objeto recibido 
      //al del la base de datos y mostramos los resultados
      juego.findByIdAndUpdate(req.params.id,{$set: {edicion: resultados.edicion}}, {new:true})
      .then(resultado=>res.status(200)
      .send({ok:true, resultado:resultado}));
      
}
//si no es correcto lanzamos un error
else { throw new Error() }
//recogemos los errores con un catch
}).catch((error) => {
      res.status(400).send({ ok: false, error: "Error modificando el juego" });
    });
  
  })
    
    //ruta que elimina el juego al pasar un id

router.delete("/:id", (req, res) => {
  juego
    .findByIdAndRemove(req.params.id)
    .then((resultado) => {
      if (resultado) res.status(200).send({ ok: true, resultado: resultado });
      else res.status(400).send({ ok: false, error: "juego no encontrado" });
    })
    .catch((error) => {
      res.status(400).send({ ok: false, error: "Error eliminando el juego" });
    });
});


//ruta que elimina las ediciones del juego al redibir un id del juego y el id de la edición

router.delete("/ediciones/:idJuego/:idEdicion", (req, res) => {
  //buscamos el juego por id
  juego.findById(req.params.idJuego).then((resultados) => {
    //filtramos el array edicion contenido en el objeto, tomando solo aquellos cuyo id sea igual al que pasamos en params
    let filtrarID = resultados.edicion.filter(
      (edicion) => edicion._id != req.params.idEdicion
    );
//damos al valor edición el valor filtrar ID y enviamos los resultados o el error 
    resultados.edicion = filtrarID;
    juego
      .findByIdAndUpdate(
        { _id: req.params.idJuego },
        { $set: { edicion: resultados.edicion } },
        { new: true }
      )
      .then((resultado) => {
        res.status(200).send({ ok: true, resultado: resultado });
      })
      .catch((error) => {
        res
          .status(400)
          .send({ ok: false, error: "Error eliminado la edición del juego" });
      });
  });
});

module.exports = router;
