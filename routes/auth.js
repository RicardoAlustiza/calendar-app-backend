/*
    This file is responsible for the routes of the application.
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { createUser, userLogin, renewUserToken } = require('../controllers/auth');
const { jwtValidators } = require('../middlewares/jwtValidators');

const router = Router();


router.post(
    '/new', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
        fieldValidators
    ],
    createUser
);

router.post(
    '/',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
        fieldValidators
    ],
    userLogin
);

router.get(
    '/renew',
    [
        check('token', 'The token is required').not().isEmpty(),
        jwtValidators
    ],
    renewUserToken
);

module.exports = router;