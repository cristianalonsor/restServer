const { Router } = require('express');
const { check, query } = require('express-validator');
const { categoryExist, isAdminRole } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { createCategory,
        getCategories,
        getCategory, 
        updateCategory,
        deleteCategory
      } = require('../controllers/categories');
const { validateUserRole } = require('../middlewares/validate-role');
 
const router = Router();

// api/categories
// All categories - Public
router.get('/', getCategories);

//  One categorie by ID - public
//  Validar con middleware personalizado de la existencia del id
router.get('/:id', [
  check('id', 'it is not a valid MongoId').isMongoId(),
  check('id').custom( categoryExist ),
  validateFields
], getCategory);

//  Create categorie - Private -> with valid role
router.post('/', [
  validateJWT,
  check('name', 'The name is mandatory').not().isEmpty(),
  validateFields
], createCategory)

//  Update categorie by ID - private -> valid token
router.put('/:id', [
  validateJWT,
  check('name', "The field 'name' is mandatory").not().isEmpty(),
  check('id').custom( categoryExist ),
  validateFields
], updateCategory);

//  Delete a categorie - Private - Admin
router.delete('/:id', [
  validateJWT,
  validateUserRole,
  check('id', 'it is not a valid MongoId').isMongoId(),
  check('id').custom( categoryExist ),
  validateFields
], deleteCategory);


module.exports = router;