// ===== IMPORTS ===== //
const nodemailer = require("nodemailer");
require("dotenv").config();

// ===== ENVIRONMENT VARIABLES ===== //
const { GOOGLE_APP_EMAIL, GOOGLE_APP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_APP_EMAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
});

module.exports = transporter;
