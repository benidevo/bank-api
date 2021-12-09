const express = require('express');
const { auth } = require('../middlewares/auth');
const {
    createAccountValidation,
    depositValidation
} = require('../middlewares/accountsValidators');
const {
    createAccount,
    deposit,
    getBalance,
    getHistory
} = require('../controllers/accounts');
const router = express.Router();

// create a new bank account
router.post('/', [auth, createAccountValidation], createAccount);
router.post('/:accountId/deposit', [auth, depositValidation], deposit);
router.get('/:accountId/balance', auth, getBalance);
router.get('/:accountId/history', auth, getHistory);

module.exports = router;
