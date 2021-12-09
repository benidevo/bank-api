const { check } = require('express-validator');

exports.registerValidation = [
    check('firstName', 'firstName is required').not().isEmpty(),
    check('lastName', 'lastName is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('confirmPassword', 'Passwords do not match').custom(
        (value, { req }) => value === req.body.password
    )
];

exports.verifyEmailValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'Please include a valid otp').not().isEmpty()
];

exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
];

exports.validateEmail = [
    check('email', 'Please include a valid email').isEmail()
];
