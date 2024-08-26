const Role = require('../models/role');
const Usuario = require('../models/user');

const isValidRole  = async( role = '' ) => {
  const roleExist = await Role.findOne({ role })
    //  Valida si existe el rol en la base de datos y si no existe, enviamos error
  if( !roleExist ) {
    throw new Error( `The role ${ role } is not in the database` )
  }
  //  si existe el rol, sigue con la ejecución 
}

const emailExist = async( email = '' ) => { // email es el campo que estoy validando contra la bd

  //  Verificar si el correo existe
  const isRepeatedMail = await Usuario.findOne({ email });
  if( isRepeatedMail ) {
    throw new Error(`The email ${ email } is in use`);
  };
 
}

const userExistById = async( id ) => { // el id del usuario es el campo que estoy validando contra la bd

  //  Verificar si el id existe
  const userExist = await Usuario.findById( id );
  if( !userExist ) {
    throw new Error(`The user wit the ${ id } id, doesn't exist in the DB`);
  };
 
}


module.exports = {
  isValidRole,
  emailExist,
  userExistById
}