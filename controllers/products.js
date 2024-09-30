const { response } = require("express");
const Product = require('../models/product');

const createProduct = async ( req, res = response ) => {

  const { state, user, name, category, ...body } = req.body;

  const productDB = await Product.findOne({ name: name.toUpperCase() });

  if( productDB ) {

    return res.status(400).json({
      ok: false,
      msg: `The product ${ productDB.name } already exist in the DB`
    });

  }

  const data = {
    name: name.toUpperCase(),
    user: req.usuario._id,
    category: req.category._id,
    ...body
  }

  try {

    const product = new Product( data );
    await product.save();

    res.json({
      ok: true,
      data
    })
    
  } catch (error) {
    
    res.status(500).json({
      ok: false,
      msg: 'Was an error in your request',
      error
    })
  }
};

const getProducts = async( req, res = response ) => {

  const { limit = 5, from = 0 } = req.query;

  const [ total, products ] = await Promise.all([
    Product.countDocuments({ state: true }),
    Product.find({ state: true })
      .skip( Number(from) )
      .limit( Number(limit) )
  ]);

  res.json({
    total,
    products
  })
};

const getProduct = async( req, res = response ) => {

  const { id } = req.params;

  try {
    const product = await Product.findById( id )
                                .populate( 'category', 'name' );

    res.status(200).json({
      ok: true,
      product
    })
  } catch (error) {
    
    return res.status(500).json({
      ok: false,
      msg: 'Error in the request',
      error
    })
  }

};

const updateProduct = async( req, res = response ) => {

  const { id } = req.params;

  const { state, user, ...data } = req.body;

  if( data.name ) {
    data.name = data.name.toUpperCase();
  }
  
  data.user = req.usuario._id;

  try {

    const product = await Product.findByIdAndUpdate( id, data, { new: true } );

    res.status(201).json({
      ok: true,
      product
    });

  } catch (error) {
    
    return res.status(500).json({
      ok: false,
      msg: 'Error in the request',
      error
    })
  }

};

const deleteCategory = async( req, res = response ) => {

  const { id } = req.params;

  const product = await Product.findByIdAndUpdate( id, { state: false }, { new: true });

  res.status(201).json({
    ok: true,
    msg: 'Product deleted successfully',
    product
  })

}


module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteCategory
}