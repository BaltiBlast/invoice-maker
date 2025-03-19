// ===== IMPORTS ===== //
const { generate } = require("@pdfme/generator");
const { text, table, line } = require("@pdfme/schemas");
require("dotenv").config();
const { ClientsMapper, ServicesMapper, UserMapper } = require("../../models/index.mapper");
const { months } = require("../../utils/genericMethods");
const transporter = require("../../configs/nodemailer");
const template = require("../../utils/templates/invoiceTemplate.json");

// ===== CONTROLLERS ===== //
const invoiceControllers = {
  // ------------------------------------------------------------------------------------ //
  // Method to display the invoice page
  getInvoice: async (req, res) => {
    try {
      const userId = req.session.user.user_id;

      // Get clients data and formating it
      const clients = await ClientsMapper.getUserClients(userId);
      const clientsData = clients.map((client) => {
        const { client_name, client_id } = client;
        return { client_name, client_id };
      });

      // Get user data and formating it
      const user = await UserMapper.getUserById(userId);
      const { user_email, user_last_name, user_first_name, user_adress, user_city_name, user_zip_code } = user;
      const userData = { user_email, user_last_name, user_first_name, user_adress, user_city_name, user_zip_code };

      // Get services
      const services = await ServicesMapper.getUserServices(userId);

      res.render("invoice/invoiceMain", { showNavbar: true, clientsData, userData, services, months });
    } catch (error) {
      console.error("[ERROR getInvoice in invoiceControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to send the invoice by email
  postSendInvoiceEmail: async (req, res) => {
    try {
      const { clientId, servicesData, invoiceMonth } = req.body;

      // Get client's informations + destructure them
      const client = await ClientsMapper.getClientById(clientId);
      const { client_name, client_adress, client_zip_code, client_city_name, client_email } = client;

      // Get user's informations + destructure them
      const user = req.session.user;
      const { user_last_name, user_first_name, user_adress, user_city_name, user_zip_code, user_email } = user;

      // Get services informations + formating them
      const services = await Promise.all(
        servicesData.map(async (service) => {
          const { serviceId, serviceQuantity } = service;
          const serviceData = await ServicesMapper.getServiceById(serviceId);
          const { service_name, service_price } = serviceData[0];
          const totalPrice = serviceQuantity * service_price;
          return [service_name, serviceQuantity.toString(), service_price, totalPrice.toString()];
        })
      );

      //  User informations for the invoice
      const userData = `${user_first_name} ${user_last_name}\n${user_adress}\n${user_zip_code} ${user_city_name}\n${user_email}`;
      const userFullName = `${user_first_name} ${user_last_name}`;

      // Client informations for the invoice
      const clientData = `${client_name}\n${client_adress}\n${client_city_name} - ${client_zip_code}\n${client_email}`;

      // Date for the invoice
      const invoiceYear = new Date().getFullYear();
      const invoiceDate = `${invoiceMonth} ${invoiceYear}`;

      // Invoice Number
      const invoiceNumber = "5";

      // Invoice Title
      const invoiceTitle = `Facture n°${invoiceNumber} - ${invoiceDate}`;

      // Invoice total service price
      const totalPrice = services.reduce((sum, service) => sum + Number(service.at(-1)), 0);

      // Dynamic invoice data
      const inputs = [
        {
          invoiceTitle: invoiceTitle,
          userData: userData,
          clientData: clientData,
          servicesData: services,
          totalPrice: totalPrice.toString(),
          paymentData: `Crédit Agricole\nIBAN : FR76 0000 0000 0000 0000 0000 000\nBIC / SWIFT : AGRIFRPP361`,
        },
      ];

      // Invoice pdf generation
      const pdf = await generate({
        template,
        inputs,
        plugins: { Table: table, Text: text, Line: line },
      });

      const appEmail = process.env.GOOGLE_APP_EMAIL;
      const mailOptions = {
        from: `"${userFullName}" <${appEmail}>`,
        to: client_email,
        subject: `Facture ${invoiceDate}`,
        text: `Bonjour, voici la facture pour ${invoiceDate}, bonne réception !`,
        attachments: [
          {
            filename: `${invoiceTitle}.pdf`,
            content: pdf,
            contentType: "application/pdf",
          },
        ],
      };
      // Send the email
      await transporter.sendMail(mailOptions);

      // Send the response
      res.json({ reload: true, success: true });
    } catch (error) {
      console.error("[ERROR postSendInvoiceEmail in invoiceControllers.js] :", error);
      res.json({ reload: true });
    }
  },
};

module.exports = invoiceControllers;
