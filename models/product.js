const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({

  name: {
    type: String,
    required: [ true, 'The name is mandatory' ],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true
  },
  img: {
    type: String
  }

});

ProductSchema.methods.toJSON = function() {
  const { _v, state, ...data } = this.toObject();
  return data;
}

module.exports = model( 'Product', ProductSchema );