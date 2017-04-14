'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gbolosta@gmail.com',
        pass: '6022141517673245'
    }
});

let mailOptions = {
    from: '"Gaurav" <gbolosta@gmail.com>', 
    to: 'gpunjabi28@gmail.com',
    subject: 'Testing', 
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
