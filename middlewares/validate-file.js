
const validateFile = ( req, res, next ) => {

  //  Validar si el archivo fué o no subido
  if ( !req.files || Object.keys(req.files).length === 0 ) {
    return res.status(400).json({
      msg: 'No files were uploaded.'
    });
  }

  if ( !req.files.archivo || req.files.archivo === null || req.files.archivo === undefined ) {
    return res.status(400).json({
      msg: 'No files were uploaded.'
    });
  }

  next();
}


module.exports = validateFile