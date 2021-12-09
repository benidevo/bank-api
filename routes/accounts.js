const express = require('express');
const { auth } = require('../middlewares/auth');
const { createAccountValidator } = require('../middlewares/accountsValidators');
const { createAccount } = require('../controllers/accounts');
const router = express.Router();

// create a new bank account
router.post('/', [auth, createAccountValidator], createAccount);

module.exports = router;
