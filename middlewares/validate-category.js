const { response } = require('express');
const Category = require('../models/category');


const validateCategory = async ( req, res = response, next ) => {
  const category = req.body.category.toUpperCase();

  try {
    
    const isCategoryInDb = await Category.findOne({ name: category });

    if( !isCategoryInDb ) {
      
      return res.status(401).json({
        ok: false,
        msg: `The category ${category} is not in the DB`
      });

    }

    if( !isCategoryInDb.state ) {
      
      return res.status(401).json({
        ok: false,
        msg: `The category ${category} was deleted from the DB`
      });

    }

    req.category = isCategoryInDb._id;

    next();
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error in the request',
      error
    });

  }
  
}

module.exports = {
  validateCategory
}