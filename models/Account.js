const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    number: {
        type: Number,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: false,
    }, 
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'TransactionHistory',
    }],
})

module.exports = mongoose.model('Account', AccountSchema);
