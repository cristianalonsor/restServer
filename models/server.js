const express = require('express')
const cors = require('cors');

//  Instancia de servidor, para no ponerlo directo en el app
class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';

    //  Middlewares -> una funcion que se ejecutará antes de algo
    this.middlewares();
    //  Rutas del server
    this.routes();
  }

  middlewares() {
    //  CORS
    this.app.use( cors() );
    //  Lectura y parseo de body en json
    this.app.use( express.json() );
    //  Directorio publico
    this.app.use( express.static( 'public' ));
  }

  //  Rutas de la aplicación
  routes() {

    //  Cuando se reciba una solicitud a x ruta, pase por acá y lo maneje el handler que indiquemos
    this.app.use(this.usersPath, require('../routes/user'));
    
  }

  listen() {

    this.app.listen(this.port, () => {
      console.clear(); 
      console.log(`Example app listening on port ${this.port}`)
    })
  }

}

module.exports = {
  Server 
}