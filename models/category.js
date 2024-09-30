const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({

  name: {
    type: String,
    required: [ true, 'The name is mandatory' ],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: [ true, 'The state is mandatory' ]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref : 'User',
    required: true
  }

});

CategorySchema.methods.toJSON = function() {
  const { __v, state, ...data } = this.toObject();
  return data;
}

module.exports = model( 'Category', CategorySchema );