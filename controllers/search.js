const { response } = require("express");
const Usuario = require("../models/user");
const Product = require('../models/product');
const Category = require('../models/category');
//  ObjectId valida que sea un id valido de mongo y retorna true o false
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles'
];

const userSearch = async ( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term );

  if( isMongoId ) {
    const user = await Usuario.findById( term );

    return res.status(200).json({
      //  Envío un arreglo para decir que si me enviaron un mongo id, el primer elemento es lo que se está buscando
      //  Y lo valido con un operador ternario para simplificarlo
      restults: ( user ) ? [ user ] : []
    });
  };

  // regex para hacer busquedas insensibles
  const regex = RegExp( term, 'i' );

  //  La consulta a la bd debe tener un or
  const users = await Usuario.find({
    //  Esta es la expresión de consultas de mongo para hacer un or, se envían objetos en el arreglo que son los criterios a cumplir
    $or: [
      { name: regex },
      { email: regex }
    ],
    $and: [{ state: true }]
  });

  res.status(200).json({      
    restults: users
  });

}

const categorySearch = async( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term );
  if( isMongoId ) {
    const category = await Category.findById( term );

    return res.status(200).json({
      restults: ( category ) ? [ category ] : []
    });
  };

  const regex = RegExp( term, 'i' );
  const categories = await Category.find({
    name: regex,
    $and: { state: true }
  })

  return res.status(200).json({
    restults: categories ? [ categories ] : []
  });

}

const productSearch = async( term = '', res = response ) => {
  
  const isMongoId = ObjectId.isValid( term );
  if( isMongoId ) {
    const product = await Product.findById( term );

    return res.status(200).json({
      restults: ( product ) ? [ product ] : []
    });
  };

  const regex = RegExp( term, 'i' );
  const categories = await Product.find({
    name: regex,
    $and: { state: true }
  })

  return res.status(200).json({
    restults: categories ? [ categories ] : []
  });
}


const search = ( req, res = response ) => {

  const { collection, term } = req.params;

  if( !allowedCollections.includes(collection) ) {
    return res.status(400).json({
      ok: false,
      msg: `The allowed search collections are ${ allowedCollections }`
    })
  };

  switch (collection) {
    case 'users':
      userSearch(term, res);
    break;

    case 'categories':
      categorySearch(term, res);
    break;

    case 'products':
      productSearch(term, res);
    break;
  
    default:
      res.status(500).json({
        ok: false,
        msg: 'Search not implemented yet'
      });
  }

}


module.exports = {
  search
}