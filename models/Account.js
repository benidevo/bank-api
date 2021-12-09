const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Type = {
    SAVINGS: 'SAVINGS',
    CURRENT: 'CURRENT'
};

const AccountSchema = new Schema({
    number: {
        type: Number,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TransactionHistory'
        }
    ],
    accountType: {
        type: String,
        enum: [Type.SAVINGS, Type.CURRENT],
        default: Type.SAVINGS
    }
});

module.exports = mongoose.model('Account', AccountSchema);
