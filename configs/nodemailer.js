const nodemailer = require("nodemailer");
require("dotenv").config();
const { GOOGLE_MAIL_USER, GOOGLE_APP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_MAIL_USER,
    pass: GOOGLE_APP_PASSWORD,
  },
});

module.exports = transporter;
