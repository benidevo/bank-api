const { check } = require('express-validator');

exports.createAccountValidation = [
    check('accountType', 'Account Type is required').not().isEmpty(),
    check('pin', 'PIN is required').not().isEmpty(),
    check('confirmPin', 'pins do not match').custom(
        (value, { req }) => value === req.body.pin
    )
];

exports.depositValidation = [
    check('amount', 'Amount is required').not().isEmpty()
];
