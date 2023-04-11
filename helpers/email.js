const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { HOST_MAIL, HOST_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: HOST_MAIL,
        pass: HOST_PASSWORD,
    },
});

const sendMail = (receiver, subject, content) => {
    ejs.renderFile(
        path.join(path.resolve("./"), "/views/mail/body.ejs"), { receiver, content },
        (err, data) => {
            if (err) {
                throw new Error(err);
            } else {
                var mailOptions = {
                    from: HOST_MAIL,
                    to: receiver,
                    subject: subject,
                    html: data,
                };

                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log("Message sent: %s", info.messageId);
                });
            }
        }
    );
};

const makeToken = (str) => {
    return Buffer.from(str).toString("base64");
};

module.exports = {
    sendMail,
    makeToken,
};