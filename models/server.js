const express = require('express')
const cors = require('cors');
const { dbConnection }  = require('../database/config');

//  Instancia de servidor, para no ponerlo directo en el app
class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    
    this.authPath   = '/api/auth';
    this.usersPath  = '/api/users';
    this.searchPath = '/api/search';
    this.productsPath   = '/api/products';
    this.categoriesPath = '/api/categories';
    

    //  Conectar DB
    this.connectionDB();

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
    this.app.use( this.authPath, require('../routes/auth'));
    this.app.use( this.usersPath, require('../routes/user'));
    this.app.use( this.categoriesPath, require('../routes/categories'));
    this.app.use( this.productsPath, require('../routes/products'));
    this.app.use( this.searchPath, require('../routes/search'));
  }

  listen() {

    this.app.listen(this.port, () => {
      console.clear(); 
      console.log(`Example app listening on port ${this.port}`)
    })
  }

  async connectionDB() {
    await dbConnection();
  }

}

module.exports = {
  Server 
}