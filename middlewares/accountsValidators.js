const { check } = require('express-validator');

exports.createAccountValidator = [
    check('accountType', 'Account Type is required').not().isEmpty()
];
