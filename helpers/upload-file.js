const path = require('path');
const { v4: uuidv4 } = require('uuid'); 


const uploadFileHelper = ( files, validExtensions = [ 'png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

  return new Promise( (resolve, reject) => {

    //  Extraigo el archivo desde la request
    const { archivo } = files;

    const cutName = archivo.name.split('.');
    const extension = cutName[ cutName.length - 1];

    if( !validExtensions.includes(extension) ) {
      return reject( 'The file extention is not allowed' );
      // return res.status(400).json({
      //   ok: false,
      //   msg: 'The file extention is not allowed'
      // })
    }
    
    const fileName = uuidv4() + '.' + extension;
    const uploadPath = path.join( __dirname, '../uploads/', folder, fileName );

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(uploadPath, function(err) {
      if ( err ) return reject( err );
      // if (err) return res.status(500).json( {err} );

      resolve( fileName );
      // res.json({
      //   msg: 'File uploaded!' + uploadPath
      // });
    });
  })



}


module.exports = {
  uploadFileHelper
}