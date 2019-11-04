const nodemailer = require("nodemailer");
const { mail } = require("./config/config");

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: "apikey",
        pass: mail
    },
    tls: {
        rejectUnauthorized: false
    }
});

function sendEmail(options) {

    const mailOptions = {
        from: `"PayWay" payway@gmail.com`,
        to: "elias.hj@gmail.com",
        subject: "Hej Zhenya",
        html:
            "<body><h3>Hello Zhenya!</h3><p>Hallå Zhenya! Hur är det med dig?</p></body>",
        ...options
    };

    transporter.sendMail(mailOptions, function(err, res) {
        if (err) {
            console.error("there was an error: ", err);
        } else {
            console.log("here is the res: ", res);
        }
    });
}

module.exports = sendEmail;