const { Router } = require('express');
const { check, query } = require('express-validator');
const { getUser, putUser, postUser, deleteUser } = require('../controllers/user');
const { isValidRole, emailExist, userExistById } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateUserRole, hasValidRole } = require('../middlewares/validate-role');

const router = Router();

//  el path que recibe la data y maneja la solicitud es el que se define en server.js
router.get('/', [
  query('limit', 'Limit must be a number').isNumeric().optional(),
  query('from', 'From must be a number').isNumeric().optional(),
  validateFields
], getUser);
//  no se ejecuta la función sino que se le hace referencia a la misma

//  :id es el parametro que estarémos recibiendo desde los parametros de la url
router.put('/:id', [
  check('id', 'Is an invalid ID').isMongoId(),
  check('id').custom( userExistById ),
  check( 'role' ).custom( isValidRole ),
  validateFields
], putUser);

router.post('/', [
  //  Valida x campo(s) con su mensaje de error, que sea email valido
  check('email', 'The email is invalid').isEmail(),
  check('name', 'The name is mandatory').not().isEmpty(),
  check('password', 'The password is mandatory and length more than 6 chars').not().isEmpty().isLength({ min: 6 }),
  // check('role', 'Has not valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  //  Check role contra base de datos
  check( 'role' ).custom( isValidRole ), // por ec6 si el argumento del callback se le pasará a una fn dentro, se puede obviar y pasar como referencia, se hará automatico
  check( 'email' ).custom( emailExist ),
  //  Middleware personalizado
  validateFields
], postUser);

router.delete('/:id', [
  validateJWT,
  // validateUserRole,
  hasValidRole("ADMIN_ROLE", "SELLER_ROLE"),
  check('id', 'Is an invalid ID').isMongoId(),
  check('id').custom( userExistById ),
  validateFields
], deleteUser);


module.exports = router;