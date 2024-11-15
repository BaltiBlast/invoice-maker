const transporter = require("../../configs/nodemailer");

const generalControllers = {
  postSendEmail: async (req, res) => {
    try {
      const { pdfInvoice, clientEmail, userEmail, date, userName } = req.body;

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
