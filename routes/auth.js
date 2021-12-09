const express = require('express');

const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
} = require('../controllers/auth');
const {
    registerValidation,
    verifyEmailValidation,
    loginValidation,
    validateEmail
} = require('../middlewares/authValidators');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/login', loginValidation, login);
router.post('/forgot-password', validateEmail, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
