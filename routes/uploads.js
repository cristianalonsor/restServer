const { Router } = require('express');
const { check, query } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { uploadFile, updateUserImg, showImage, cloudinaryImg } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers/db-validators');
const validateFile = require('../middlewares/validate-file');

const router = Router();

router.post('/', validateFile, uploadFile);

// router.put('/:collection/:id', [
//   check('id', 'The id is not a valid MongoId').isMongoId(),
//   check('collection').custom( collection => allowedCollections( collection, ['users', 'products']) ),
//   validateFile,
//   validateFields
// ], updateUserImg);

router.put('/:collection/:id', [
  check('id', 'The id is not a valid MongoId').isMongoId(),
  check('collection').custom( collection => allowedCollections( collection, ['users', 'products']) ),
  validateFile,
  validateFields
], cloudinaryImg);

router.get('/:collection/:id', [
  check('id', 'The id is not a valid MongoId').isMongoId(),
  check('collection').custom( collection => allowedCollections( collection, ['users', 'products']) ),
  validateFields
], showImage);


module.exports = router;