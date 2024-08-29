const jwt = require('jsonwebtoken');


const generateJWT = ( uid = '' ) => {

  return new Promise( (resolve, reject ) => {

    //  Tratar de grabar la menor data importante posible
    const payload = { uid };

    jwt.sign( payload, process.env.SECRETTOKENKEY, {
      expiresIn: '4h'
    }, (error, token) => {
      
      if( error ) {
        console.log(error);
        reject( 'Token not generated' );
      } else {
        resolve( token );
      }
    })

  });
}

module.exports = {
  generateJWT
}