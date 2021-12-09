const express = require('express');
const { auth } = require('../middlewares/auth');
const {
    createAccountValidation,
    depositValidation,
    withdrawValidation,
    transferValidation,
} = require('../middlewares/accountsValidators');
const {
    createAccount,
    deposit,
    getBalance,
    getHistory,
    withdrawal,
    transfer
} = require('../controllers/accounts');
const router = express.Router();

// create a new bank account
router.post('/', [auth, createAccountValidation], createAccount);
router.post('/:accountId/deposit', [auth, depositValidation], deposit);
router.get('/:accountId/balance', auth, getBalance);
router.get('/:accountId/history', auth, getHistory);
router.post('/:accountId/withdrawal', [auth, withdrawValidation], withdrawal);
router.post('/:accountId/transfer', [auth, transferValidation], transfer);

module.exports = router;
