// ===== IMPORTS ===== //
const { ClientsMapper, ServicesMapper, UserMapper, InvoicesMapper } = require("../../models/index.mapper");
const { months } = require("../../utils/genericMethods");
const transporter = require("../../configs/nodemailer");

// ===== CONTROLLERS ===== //
const invoiceControllers = {
  // ------------------------------------------------------------------------------------ //
  // Method to display the invoice page
  getInvoice: async (req, res) => {
    try {
      // Get clients data and formating it
      const clients = await ClientsMapper.getClients();
      const clientsData = clients.map((client) => {
        const { client_name, client_id } = client;
        return { client_name, client_id };
      });

      // Get user data and formating it
      const user = await UserMapper.getUser();
      const { user_email, user_last_name, user_first_name, user_adress, user_city_name, user_zip_code } = user;
      const userData = { user_email, user_last_name, user_first_name, user_adress, user_city_name, user_zip_code };

      // Get services
      const services = await ServicesMapper.getServices();

      res.render("invoice", { showNavbar: true, clientsData, userData, services, months });
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
