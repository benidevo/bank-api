const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    transactionPin: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);
