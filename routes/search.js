const { Router } = require('express');
const { check, query } = require('express-validator');
const { search } = require('../controllers/search');

const router = Router();


router.get( '/:collection/:term', search );

module.exports = router;