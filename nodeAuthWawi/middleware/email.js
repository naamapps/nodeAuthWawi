const nodemailer = require('nodemailer');

exports.send = function (to, subject, body) {
    let mailerConfig = {
        host: "smtpout.europe.secureserver.net",
        secureConnection: true,
        port: 587,
        auth: {
            user: "support@singit.io",
            pass: "Benben73!"
        }
    };
    let transporter = nodemailer.createTransport(mailerConfig);

    let mailOptions = {
        from: mailerConfig.auth.user,
        to: to,
        subject: subject,
        text: body
};

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log('error:', error);
        } else {
            console.log('good');
        }
    });
}