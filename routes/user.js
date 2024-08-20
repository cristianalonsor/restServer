const { Router } = require('express');
const { getUser, putUser, postUser, deleteUser } = require('../controllers/user');

const router = Router();

//  el path que recibe la data y maneja la solicitud es el que se define en server.js
router.get('/', getUser);
//  no se ejecuta la función sino que se le hace referencia a la misma

//  :id es el parametro que estarémos recibiendo desde los parametros de la url
router.put('/:id', putUser);

router.post('/', postUser);

router.delete('/', deleteUser);


module.exports = router;