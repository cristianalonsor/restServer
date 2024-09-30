const { response } = require("express");
const Category = require('../models/category');

const createCategory = async( req, res = response ) => {

  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne( { name } );

  //  Verificar la existencia de la categoría en la BD
  if( categoryDB ) {

    return res.status(400).json({
      ok: false,
      msg: `That category ${ categoryDB.name } already exist in the DB`
    })

  }

  //  Preparar la data para insertarla en la DB
  const data = {
    name,
    user: req.usuario._id
  }

  //  Grabar la data en la DB
  try {
    const category = new Category( data );
    await category.save();

    res.status(201).json({
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

}

//  getCategories - paginado - total - populate
const getCategories = async( req, res = response ) => {

  const { limit = 5, from = 0 } = req.query;

  const [ total, categories ] = await Promise.all([
    Category.countDocuments({ state: true }),
    Category.find({ state: true })
      .populate('user', 'name')
      .skip( Number(from) )
      .limit( Number(limit) )
  ]);

  res.status(200).json({
    total,
    categories
  })

}

//  getCategory - populate { objt categoria }
const getCategory = async( req, res = response ) => {

  const { id } = req.params;
  try {
    
    const category = await Category.findById( id )
                                   .populate('user', 'name');
  
    res.status(200).json(
      category
    );

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error in the request",
      error
    })
  }
}

//  updateCategory - recibir nombre y con ello modificarlo
const updateCategory = async( req, res = response ) => {

  const { id } = req.params;
  //  state no se puede cambiar, por eso lo extraemos
  //  el usuario lo tomamoes para extraerlo por si alguien lo quiere enviar
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  //  pasamos el usuario a la req cuando validamos el token
  data.user = req.usuario._id;

  const category = await Category.findByIdAndUpdate( id, data, { new: true } ).populate('user','name');

  res.status(201).json({
    ok: true,
    category
  })

}

//  deleteCategory - cambiar el state a false
const deleteCategory = async( req, res = response ) => {

  const { id } = req.params;

  const category = await Category.findByIdAndUpdate( id, { state: false }, { new: true } );

  res.status(200).json({
    ok: true,
    msg: 'Category deleted',
    category
  })


}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}