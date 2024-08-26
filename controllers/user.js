const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');
const { query, validationResult } = require('express-validator');
const Usuario = require('../models/user');

const getUser = async( req = request, res = response ) => {

  // const params = req.query;
  const { limit = 5, from = 0 } = req.query;

  //  Busco a todos los usuarios, con una condición dentro del find y pagino
  //  Manejo estas promesas en una colección, para que no se bloquee el código cada ejecución
  //  const users = await Usuario.find({ state: true })
  //   .skip( Number(from) )
  //   .limit( Number(limit) )
  //  const total = await Usuario.countDocuments({ state: true });

  //  Ejecuta promesas simultaneas
  const [ total, users ] = await Promise.all([
    Usuario.countDocuments({ state: true }),
    Usuario.find({ state: true })
    .skip( Number(from) )
    .limit( Number(limit) ),
  ])

  res.json({
    total,
    users
  })
}

const putUser = async( req = request, res = response ) => {
  //  req.params.el_nombre_que_hayamos_puesto_en_la_ruta
  // const id = req.params.id;
  //  obtenemos los valores desde el params desestructurando el objeto
  const { id } = req.params;

  console.log(id);
  const { _id, password, google, role, ...rest } = req.body;

  //  TODO Validar contra bd
  if( password ) {
    //  Actualizar Password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync( password, salt );
  }

  const userDB = await Usuario.findByIdAndUpdate( id, rest, { new: true } )

  res.json({
    ok: true,
    msg: 'User Updated successfully',
    userDB
  })
}

const postUser = async( req = request, res = response ) => {

  //  ocupamos la desestructuración de objetos
  const { name, email, password, role } = req.body;

  //  Instanciamos un objeto que agregaremos a la base de datos con sus propiedades obtenidas desde el body
  const usuario = new Usuario( {
    name,
    email,
    password,
    role
  } );  

  //  Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  //  Enciptar en una sóla vía
  usuario.password = bcryptjs.hashSync( password, salt );

  //  Realizamos la inserción con  mongoose
  await usuario.save();
  
  res.json({
    ok: true,
    msg: 'User Created successfully',
    usuario
  })
}

const deleteUser = async( req = request, res = response ) => {

  const { id } = req.params;

  //  Borrar fisico
  // const user = await Usuario.findByIdAndDelete( id );

  const user = await Usuario.findByIdAndUpdate( id, { state: false }, { new: true} );

  res.json({
    ok: true,
    msg: 'User deleted from the DB',
    user
  })
}




module.exports = {
  getUser,
  putUser,
  postUser,
  deleteUser
}