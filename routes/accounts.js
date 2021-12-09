const express = require('express');
const { auth } = require('../middlewares/auth');
const { createAccountValidation, depositValidation } = require('../middlewares/accountsValidators');
const { createAccount, deposit } = require('../controllers/accounts');
const router = express.Router();

// create a new bank account
router.post('/', [auth, createAccountValidation], createAccount);
router.post('/:accountId/deposit', [auth, depositValidation], deposit);

module.exports = router;
