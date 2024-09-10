

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

  name: {
    type: String,
    required: [true, 'The name is required']
  },
  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'SELLER_ROLE']
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }

});

//  Elimino propiedades del objeto que enviaré como respuesta si es del modelo
UsuarioSchema.methods.toJSON = function() {

  const { __v, password, _id, ...user } = this.toObject();
  //  Cambiamos el _id de mongo por un uid
  user.uid = _id;
  return user;

}
  


module.exports = model( 'User', UsuarioSchema );