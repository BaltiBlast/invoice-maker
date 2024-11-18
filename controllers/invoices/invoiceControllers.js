// ===== IMPORTS ===== //
const { ClientsMapper, ServicesMapper, UserMapper, InvoicesMapper } = require("../../models/index.mapper");
const { allMonths } = require("../../utils/genericMethods");
const transporter = require("../../configs/nodemailer");

// ===== CONTROLLERS ===== //
const invoiceControllers = {
  // ------------------------------------------------------------------------------------ //
  // Method to display the invoice page
  getInvoice: async (req, res) => {
    try {
      const clients = await ClientsMapper.getClients();
      const services = await ServicesMapper.getServices();
      const months = allMonths;
      const user = await UserMapper.getUser();

      res.render("invoice", { showNavbar: true, clients, services, months, user });
    } catch (error) {
      console.error("[ERROR getInvoice in invoiceControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to send the invoice by email
  postSendInvoiceEmail: async (req, res) => {
    try {
      const { pdfInvoice, clientEmail, userEmail, date, userName, recordId, newTotalPrice, invoiceDbData } = req.body;

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

      // Send the email
      await transporter.sendMail(mailOptions);

      // Add the invoice's informations database
      await InvoicesMapper.addInvoice(invoiceDbData);

      // Update the client total price
      await ClientsMapper.updateClient({ recordId, newTotalPrice });
      res.json({ reload: true, success: true });
    } catch (error) {
      console.error("[ERROR postSendInvoiceEmail in invoiceControllers.js] :", error);
      res.json({ reload: true });
    }
  },
};

module.exports = invoiceControllers;
