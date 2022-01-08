const nodemailer = require('nodemailer');
require('dotenv').config();

// const AccountNumbers = require('../models/accountNumbers');

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

exports.sendMail = async function (recipients, subject, text) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: USERNAME, // generated ethereal user
            pass: PASSWORD // generated ethereal password
        }
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Ben Bank" <benidevoo@gmail.com>', // sender address
        to: recipients, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: `<b>${text}</b>` // html body
    });
    return 'message sent';
};

exports.generateAccountNumber = async function () {
    let accountNumber = '22';
    for (let i = 0; i < 8; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }

    // const accountNumberFound = await AccountNumbers.findOne({ number: Number(accountNumber) });
    // while (accountNumberFound) {
    //     generateAccountNumber();
    // }
    // const newAccountNumber = new AccountNumbers({ number: Number(accountNumber) });
    // await newAccountNumber.save();
    return Number(accountNumber);
};
