var nodemailer = require('nodemailer');

module.exports = function (mailOptions, callback) {
    // create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '<provide the email id>',
            pass: '<provide the password>'
        }
    });

    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        } else {
            callback('success');
        }
    });
}