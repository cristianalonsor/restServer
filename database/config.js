const mongoose = require('mongoose');
 
//  Conexión básica de una base de datos en MONGO
const dbConnection = async() => {

  try {

    await mongoose.connect( process.env.MONGO_CONN )    
    console.log('Successfully Connection');

  } catch (error) {
    console.log(error);
    throw new Error('Error in the connection with the DB');
  }


}

module.exports = {
  dbConnection
}
