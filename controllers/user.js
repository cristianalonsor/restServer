const { response, request } = require('express');

const getUser = ( req = request, res = response ) => {

  // const params = req.query;
  const { q, nombre = 'no name', apellido } = req.query;

  res.json({
    ok: true,
    msg: 'get API - controller',
    q,
    nombre,
    apellido
  })
}

const putUser = ( req = request, res = response ) => {
  //  req.params.el_nombre_que_hayamos_puesto_en_la_ruta
  const id = req.params.id;

  res.json({
    ok: true,
    msg: 'put API - controller',
    id
  })
}

const postUser = ( req = request, res = response ) => {

  //  ocupamos la desestructuración de objetos
  const { nombre, edad } = req.body;

  res.json({
    ok: true,
    msg: 'post API - controller',
    nombre,
    edad
  })
}

const deleteUser = ( req = request, res = response ) => {
  res.json({
    ok: true,
    msg: 'delete API - controller'
  })
}




module.exports = {
  getUser,
  putUser,
  postUser,
  deleteUser
}