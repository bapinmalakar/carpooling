const nodemailer = require('@nodemailer/pro');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(obj) {
    return new Promise((resolve, reject) => {
        console.log('In root to mail send file...');
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'carpool.ride20@gmail.com',
                pass: 'carpooling123'
            }
        }));
        let mailOptions = {
            from: '<carpool.ride20@gmail.com>', // sender address
            to: obj.email, // list of receivers
            subject: obj.subject, // Subject line
            text: obj.msg, // plain text body
            html: obj.html_msg // html body
        };
        console.log('sending function: ', obj.email);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error due to send mail' + error);
                reject(error);
            } else {
                console.log('Message %s sent: %s', info.messageId, info.response);
                resolve(info);
            }
        });
    });
}