const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');

const validateJWT = async ( req = request, res, next ) => {

  const token = req.header('x-token');
  if( !token ) {
    return res.status(401).json({
      msg: 'No token on the request'
    })
  }

  try {

    //  Verificamos el token y le asignamos el uid del usuario a la request que se utilizará en todo ese controlador
    const { uid } = jwt.verify( token, process.env.SECRETTOKENKEY )

    //  leer el user correponde al uid
    const usuario = await Usuario.findById( uid );
    req.usuario = usuario;

    //  validar el estado del usuario -> eliminado no logea
    if( !usuario ) {

      return res.status(401).json({
        msg: 'Token invalid - User not in DB'
      });

    } 

    if( !usuario.state ) {

      return res.status(401).json({
        msg: 'Token invalid - state false'
      })

    };
    
    next();
  } catch (error) {
    res.status(401).json({
      msg: 'Invalid token'
    })
  }

}

module.exports = {
  validateJWT
}