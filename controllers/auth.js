const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const { generateJWT } = require("../helpers/generateToken");

const login = async( req = request, res = response ) => {

  const { email, password } = req.body;

  try {
    
    //  Verificar existencia email
    const user = await Usuario.findOne({ email });

    if( !user ) {
      return res.status(400).json({
        msg: 'Usuario/Password has an error - email'
      })
    }
    //  Verificar si usuario está activo en bd
    if( !user.state ) {
      return res.status(400).json({
        msg: 'Usuario/Password has an error - state false'
      })
    }

    //  Verificar el password del usuario
    const validPassword = bcryptjs.compareSync( password, user.password );
    if( !validPassword ) {
      return res.status(400).json({
        msg: 'Usuario/Password has an error - password'
      })
    }

    //  Generar el JWT
    const token = await generateJWT( user.id );

    res.status(200).json({
      msg: 'Login successfully',
      user,
      token
    })

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: 'Something went wrong',
    })
  }
}


module.exports = {
  login
}