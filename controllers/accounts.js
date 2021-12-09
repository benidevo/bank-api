const { validationResult } = require('express-validator');
const Account = require('../models/Account');
const User = require('../models/User');
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
    const { accountType } = req.body;
    const account = new Account({
        owner: id,
        accountType
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

    // generate account number
    const accountNumber = await generateAccountNumber(account._id);
    account.number = accountNumber;

    user.account = account._id;
    await user.save();
    res.status(201).json({ account });
};
