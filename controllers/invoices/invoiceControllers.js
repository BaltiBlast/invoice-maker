const { ClientsMapper, ServicesMapper, UserMapper, InvoicesMapper } = require("../../models/index.mapper");
const transporter = require("../../configs/nodemailer");
const { allMonths } = require("../../utils/genericMethods");

const invoiceControllers = {
  getInvoice: async (req, res) => {
    try {
      const clients = await ClientsMapper.getClients();
      const services = await ServicesMapper.getServices();
      const months = allMonths;
      const user = await UserMapper.getUser();

      res.render("invoice", { showNavbar: true, clients, services, months, user });
    } catch (error) {
      console.error("[ERROR GETTING INVOICE] ", error);
    }
  },

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

      await transporter.sendMail(mailOptions);
      await InvoicesMapper.addInvoice(invoiceDbData);

      await ClientsMapper.updateClient({ recordId, newTotalPrice });
      res.json({ reload: true, success: true });
    } catch (error) {
      console.error("[ERROR SENDING EMAIL] ", error);
      res.json({ reload: true });
    }
  },
};

module.exports = invoiceControllers;
