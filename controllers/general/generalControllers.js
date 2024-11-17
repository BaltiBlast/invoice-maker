const transporter = require("../../configs/nodemailer");
const { ClientsMapper } = require("../../models/index.mapper");

const generalControllers = {
  postSendEmail: async (req, res) => {
    try {
      const { pdfInvoice, clientEmail, userEmail, date, userName, recordId, newTotalPrice } = req.body;

      const invoiceBase64 = pdfInvoice.split(",")[1];
      const invoiceBuffer = Buffer.from(invoiceBase64, "base64");

      const mailOptions = {
        from: userEmail,
        to: clientEmail,
        subject: `Facture pour le mois de ${date}`,
        text: `Bonjour, voici la facture pour ${date}, bonne réception !`,
        attachments: [
          {
            filename: `facture ${userName} ${date}.pdf`,
            content: invoiceBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      await ClientsMapper.updateClient({ recordId, newTotalPrice });
      res.json({ reload: true });
    } catch (error) {
      console.error("[ERROR SENDING EMAIL] ", error);
      res.json({ reload: true });
    }
  },

  getHome: (req, res) => {
    res.redirect("/invoice");
  },

  get404: (req, res) => {
    res.render("404", { showNavbar: true });
  },
};

module.exports = generalControllers;
