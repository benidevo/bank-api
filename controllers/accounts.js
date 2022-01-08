const { validationResult } = require('express-validator');
const Account = require('../models/Account');
const User = require('../models/User');
const TransactionHistory = require('../models/TransactionHistory');
const { generateAccountNumber } = require('../utils');

/**
 * @desc creates a new bank account for the authenticated user
 */
exports.createAccount = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { id } = req.user;

    let user;
    try {
        user = await User.findById(id);
        if (user.account) {
            return res
                .status(400)
                .json({ msg: 'You already have a bank account' });
        }
    } catch (err) {
        if (err.message === "Cannot read property 'account' of null") {
            return res
                .status(401)
                .json({ msg: 'Invalid authentication credentials' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    // create bank account
    const { accountType, pin, confirmPin } = req.body;
    if (pin !== confirmPin) {
        return res.status(400).json({ msg: 'Pins do not match' });
    }
    const account = new Account({
        owner: id,
        accountType,
        pin,
        number: await generateAccountNumber(),
    });

    try {
        await account.save();
    } catch (err) {
        console.log(err.message);
        if (err.message.includes('is not a valid enum value')) {
            return res.status(400).json({ msg: 'Invalid account type' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    user.account = account._id;
    await user.save();
    res.status(201).json({ account });
};

/**
 *  @desc deposit money into a bank account
 */
exports.deposit = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.user;
    const { accountId } = req.params;
    const { amount, description } = req.body;

    // check if user has an account
    let account;
    try {
        account = await Account.findById(accountId);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value')) {
            return res.status(400).json({ msg: 'Invalid account ID' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    if (!account) {
        return res.status(400).json({ msg: 'Bank Account not found' });
    }
    // check if user owns the account
    if (account.owner.toString() !== id) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    // create transaction history
    const transaction = new TransactionHistory({
        title: 'DEPOSIT',
        type: 'CREDIT',
        amount,
        description,
        account: accountId
    });

    try {
        await transaction.save();
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server error' });
    }

    // update account balance
    account.balance += amount;
    account.transactions.push(transaction._id);
    await account.save();
    res.status(200).json({ account });
};

/**
 * @desc retrieves account balance for the authenticated user
 */
exports.getBalance = async function (req, res) {
    const { id } = req.user;
    const { accountId } = req.params;

    // check if user has an account
    let account;
    try {
        account = await Account.findById(accountId);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value')) {
            return res.status(400).json({ msg: 'Invalid account ID' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    if (!account) {
        return res.status(404).json({ msg: 'Bank Account not found' });
    }

    // check if user owns the account
    if (account.owner.toString() !== id) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    res.status(200).json({ balance: account.balance });
};

/**
 * @desc retrieves transaction history for the authenticated user
 */
exports.getHistory = async function (req, res) {
    const { id } = req.user;
    const { accountId } = req.params;

    // check if user has an account
    let account;
    try {
        account = await Account.findById(accountId);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value')) {
            return res.status(400).json({ msg: 'Invalid account ID' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    if (!account) {
        return res.status(404).json({ msg: 'Bank Account not found' });
    }

    // check if user owns the account
    if (account.owner.toString() !== id) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const transactions = await TransactionHistory.find({ account: accountId });
    res.status(200).json({ transactions });
};

exports.withdrawal = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    const { id } = req.user;
    const { accountId } = req.params;
    const { amount, description, pin } = req.body;

    // check if user has an account
    let account;
    try {
        account = await Account.findById(accountId);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value')) {
            return res.status(400).json({ msg: 'Invalid account ID' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    if(!account) {
        return res.status(404).json({ msg: 'Bank Account not found' });
    }

    if (account.owner.toString() !== id) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (account.balance < amount) {
        return res.status(400).json({ msg: 'Insufficient funds' });
    }

    if (account.pin !== pin) {
        return res.status(400).json({ msg: 'Invalid pin' });
    }
    // withdraw money
    account.balance -= amount;
    // create transaction history
    const transaction = new TransactionHistory({
        title: 'WITHDRAWAL',
        type: 'DEBIT',
        amount,
        description,
        account: accountId
    });

    await transaction.save();
    account.transactions.push(transaction._id);
    await account.save();
    res.status(200).json({ msg: 'Withdrawal successful' });
};

exports.transfer = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.user;
    const { accountId } = req.params;
    const { amount, description, pin, accountNumber } = req.body;

    // check if user has an account
    let account;
    try {
        account = await Account.findById(accountId);
    }
    catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value')) {
            return res.status(400).json({ msg: 'Invalid account ID' });
        }
        return res.status(500).json({ message: 'Server error' });
    }

    if (!account) {
        return res.status(404).json({ msg: 'Bank Account not found' });
    }

    if (account.owner.toString() !== id) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (account.balance < amount) {
        return res.status(400).json({ msg: 'Insufficient funds' });
    }

    let receiverAccount;
    try {
        receiverAccount = await Account.findOne({ number: accountNumber });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }

    if (!receiverAccount) {
        return res.status(404).json({ msg: 'Invalid receiver account number' });
    }

    if (account.pin !== pin) {
        return res.status(400).json({ msg: 'Invalid pin' });
    }

    account.balance -= amount;
    receiverAccount.balance += amount;

    // create transaction history
    const receiverTransaction = new TransactionHistory({
        title: 'TRANSFER',
        type: 'CREDIT',
        amount,
        description,
        account: receiverAccount._id
    });

    const senderTransaction = new TransactionHistory({
        title: 'TRANSFER',
        type: 'DEBIT',
        amount,
        description,
        account: accountId
    });

    await receiverTransaction.save();
    await senderTransaction.save();

    account.transactions.push(senderTransaction._id);
    receiverAccount.transactions.push(receiverTransaction._id);
    
    await account.save();
    await receiverAccount.save();

    res.status(200).json({ msg: 'Transfer successful' });
};