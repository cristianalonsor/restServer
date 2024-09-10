const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const { generateJWT } = require("../helpers/generateToken");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async( req = request, res = response ) => {

  const { id_token } = req.body;

  try {
    const googleUser = await googleVerify( id_token );

    console.log(googleUser);

    //  Verificar si existe el correo en la bd
    let user = await Usuario.findOne( { email: googleUser.email } );
    
    if( !user ) {
      //  Crear al usuario
      const data = {
        name: googleUser.name,
        email: googleUser.email,
        password: 'default',
        img: googleUser.picture,
        role: 'USER_ROLE',
        google: true
      }

      user = new Usuario( data );
      await user.save();
      console.log( 'nuevo usuario: ',user );
    }

    console.log('ya existia usuario: ', user );

    //  Si el usuario en DB tiene state false or true
    if( !user.state ) {
      return res.status(401).json({
        ok: false,
        msg: 'Not authorized - User Blocked'
      })
    }

    //  Generar el jwt
    const token = await generateJWT( user.id );

    res.json({
      id_token,
      user,
      token,
      msg: 'todo ok'
    })
  
  } catch (error) {

    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar',
      error
    })
    
  }
}


module.exports = {
  login,
  googleSignIn
}