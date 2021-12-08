const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Type = {
    DEBIT: 'DEBIT',
    CREDIT: 'CREDIT'
};

const Title = {
    DEPOSIT: 'DEPOSIT',
    WITHDRAWAL: 'WITHDRAWAL',
    TRANSFER: 'TRANSFER'
};

const TransactionHistorySchema = new Schema({
    title: {
        type: String,
        required: true,
        enum: [Title.DEPOSIT, Title.WITHDRAWAL, Title.TRANSFER]
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [Type.DEBIT, Type.CREDIT]
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    beneficiary: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('TransactionHistory', TransactionHistorySchema);
