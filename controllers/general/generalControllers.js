const puppeteer = require("puppeteer");
const transporter = require("../../configs/nodemailer");
require("dotenv").config();

const { APP_URL } = process.env;

const generalControllers = {
  postSendEmail: async (req, res) => {
    try {
      const { htmlContent, clientEmail, userEmail, date, userName } = req.body;

      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();

      await page.setContent(`
        <html>
          <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css" />
            <link rel="stylesheet" href="${APP_URL}/css/style.css" />
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);

      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      const mailOptions = {
        from: userEmail,
        to: clientEmail,
        subject: `Facture pour le mois de ${date}`,
        text: `Bonjour, voici la facture pour ${date}, bonne réception !`,
        attachments: [
          {
            filename: `facture ${userName} ${date}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      res.json({ reload: true, toastSuccessMessage: "Factgure envoyé" });
    } catch (error) {
      console.error("[ERROR SENDING EMAIL] ", error);
      res.json({ reload: true, toastFailMessage: "Erreur lors de l'envoi de la facture" });
    }
  },

  get404: (req, res) => {
    res.render("404", { showNavbar: true });
  },
};

module.exports = generalControllers;
