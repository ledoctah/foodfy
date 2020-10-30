const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "4fe30c8f7d6088",
        pass: "b82687e9881244"
    }
});