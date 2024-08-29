const { request } = require("express");


const validateUserRole = async ( req = request, res, next ) => {

  if( !req.usuario ) {

    res.status(500).json({
      msg: 'Internal server error - Validar rol sin validar el usuario'
    })

  }

  const { role } = req.usuario;
  
  if( role !== "ADMIN_ROLE" ) {

    return res.status(403).json({
      msg:'Role not authorized for transaction - Not Admin'
    });

  }

  next();
  
}

//  Recibo mis roles en la función que ejecuto y retorno una función con la req, res y next
const hasValidRole = ( ...roles ) => {

  //  Utilizo el next si sale bien
  return ( req = request, res, next ) => {

    if( !req.usuario ) {

      res.status(500).json({
        msg: 'Internal server error - Validar rol sin validar el usuario'
      });

    };

    const { role } = req.usuario;

    if( !roles.includes( role ) ) {

      return res.status(401).json({
        msg:'Role not authorized for transaction - Not Admin||Seller'
      });

    }

    next();

  }

}


module.exports = {
  validateUserRole,
  hasValidRole
}