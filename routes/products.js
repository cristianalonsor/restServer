const { Router } = require('express');
const { check, query } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteCategory
} = require('../controllers/products');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { productExist } = require('../helpers/db-validators');
const { validateCategory } = require('../middlewares/validate-category');
const { validateUserRole } = require('../middlewares/validate-role');

const router = Router();

router.get('/', getProducts)

router.get('/:id', [
  check('id', 'it is not a valid MongoId').isMongoId(),
  check('id').custom( productExist ),
  validateFields
], getProduct)

router.post('/', [
  validateJWT,
  validateCategory,
  check('name', 'The name is mandatory').not().isEmpty(),
  validateFields
], createProduct);

router.put('/:id', [
  validateJWT,
  check('id','Is not a valid mongoId').isMongoId(),
  check('id').custom( productExist ),
  validateFields
], updateProduct)

router.delete('/:id', [
  validateJWT,
  validateUserRole,
  check('id','Is not a valid mongoId').isMongoId(),
  validateFields
], deleteCategory)

module.exports = router;