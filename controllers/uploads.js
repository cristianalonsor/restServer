const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { uploadFileHelper } = require("../helpers/upload-file");
const Usuario = require('../models/user') ;
const Product = require('../models/product') ;
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );


const uploadFile = async( req, res = response ) => {

  // console.log(req.files.archivo.name);

  // res.json({
  //   ok: true
  // });

  try {  

    // const name = await uploadFileHelper( req.files, ['txt', 'md'], 'textos' );
    const name = await uploadFileHelper( req.files, undefined, 'imgs' );

    res.json({
      name
    })

  } catch (error) {
    
    res.status(400).json({
      error
    });

  }
}

const updateUserImg = async( req, res = response ) => {

  const { id, collection } = req.params;

  let modelo;

  switch ( collection ) {
    case 'users':

      modelo = await Usuario.findById( id );
      if( !modelo ) {
        return res.status(400).json({
          ok: false,
          msg: `The user with id: ${id} is not in the DB`
        })
      }
      
    break;

    case 'products':

      modelo = await Product.findById( id );
      if( !modelo ) {
        return res.status(400).json({
          ok: false,
          msg: `The product with id: ${id} is not in the DB`
        })
      }
      
    break;

    default:

      res.status(500).json({
        ok: false,
        msg: 'This is not validated yet'
      })
    break;
  }

  //  Limpieza previa de imagenes
  if( modelo.img ) {
    //  Borrar img del server
    const pathImg = path.join( __dirname, '../uploads', collection, modelo.img );
    //  Existe fisicamente la imagen y la borramos
    if( fs.existsSync( pathImg ) ){
      fs.unlinkSync( pathImg );
    }
  }

                                //  mando img, las extensiones, la carpeta dnde almacenaré
  const name = await uploadFileHelper( req.files, undefined, collection );
  modelo.img = name;

  await modelo.save();

  res.json( modelo )

}

const cloudinaryImg = async( req, res = response ) => {

  const { id, collection } = req.params;

  let modelo;

  switch ( collection ) {
    case 'users':

      modelo = await Usuario.findById( id );
      if( !modelo ) {
        return res.status(400).json({
          ok: false,
          msg: `The user with id: ${id} is not in the DB`
        })
      }
      
    break;

    case 'products':

      modelo = await Product.findById( id );
      if( !modelo ) {
        return res.status(400).json({
          ok: false,
          msg: `The product with id: ${id} is not in the DB`
        })
      }
      
    break;

    default:

      res.status(500).json({
        ok: false,
        msg: 'This is not validated yet'
      })
    break;
  }

  //  Limpieza previa de imagenes
  if( modelo.img ) {
    //  Borrar img de cloudinary
    const nameArr = modelo.img.split('/');
    const name = nameArr[ nameArr.length - 1];
    const [ public_id ] = name.split('.');

    await cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  modelo.img = secure_url;
  await modelo.save();

  res.json( secure_url )

}

const showImage = async( req, res = response ) => {

  const { id, collection } = req.params;

  let modelo;

  switch ( collection ) {
    case 'users':

      modelo = await Usuario.findById( id );
      if( !modelo ) {
        return res.status(400).json({
          ok: false,
          msg: `The user with id: ${id} is not in the DB`
        })
      }
      
    break;

    case 'products':

      modelo = await Product.findById( id );
      if( !modelo ) {
        return res.status(400).json({
          ok: false,
          msg: `The product with id: ${id} is not in the DB`
        })
      }
      
    break;

    default:

      res.status(500).json({
        ok: false,
        msg: 'This is not validated yet'
      })
    break;
  }

  if( modelo.img ) {

    const pathImg = path.join( __dirname, '../uploads', collection, modelo.img );
    
    if( fs.existsSync( pathImg ) ){
      return res.sendFile( pathImg )
    }
  }

  const noImg = path.join( __dirname, '../assets/no-image.jpg' );
  res.sendFile( noImg );

}


module.exports = {
  uploadFile,
  updateUserImg,
  showImage,
  cloudinaryImg
}