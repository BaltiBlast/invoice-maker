// Mapper
const { ServicesMapper, InvoiceServicesMapper } = require("../../models/index.mapper");

// PDF
const { generate } = require("@pdfme/generator");
const { text, table, line } = require("@pdfme/schemas");
const template = require("../../utils/templates/invoiceTemplate.json");

// Nodemailer
const transporter = require("../../configs/nodemailer");

// Environment variables
require("dotenv").config();

// Utils
const { userFullName } = require("../../utils/genericMethods");

// ===== CONTROLLERS METHODS ===== //
const invoiceControllersMethods = {
  // ------------------------------------------------------------------------------------ //
  // Return an array with the services formated for the invoice
  formatingInvoiceServices: async (services) => {
    return await Promise.all(
      services.map(async (service) => {
        const { serviceId, serviceQuantity } = service;
        const serviceData = await ServicesMapper.getServiceById(serviceId);
        const { service_name, service_price } = serviceData[0];
        const totalPrice = serviceQuantity * service_price;
        return [service_name, serviceQuantity.toString(), service_price, totalPrice.toString()];
      })
    );
  },

  // ------------------------------------------------------------------------------------ //
  // Return a string with the user informations formated for the invoice
  formatingInvoiceUserInformations: (userData) => {
    const fullName = userFullName(userData);
    const { user_email, user_adress, user_city_name, user_zip_code } = userData;
    return `${fullName}\n${user_adress}\n${user_zip_code} ${user_city_name}\n${user_email}`;
  },

  // ------------------------------------------------------------------------------------ //
  // Return a string with the client informations formated for the invoice
  formatingInvoiceClientData: (clientData) => {
    const { client_name, client_adress, client_zip_code, client_city_name, client_email } = clientData;
    return `${client_name}\n${client_adress}\n${client_city_name} - ${client_zip_code}\n${client_email}`;
  },

  // ------------------------------------------------------------------------------------ //
  // Return the pdf invoice generated
  invoicePdfGenerator: async (inputs) => {
    return await generate({
      template,
      inputs,
      plugins: { Table: table, Text: text, Line: line },
    });
  },

  // ------------------------------------------------------------------------------------ //
  // Send the invoice by email
  sendInvoiceEmail: async (emailData) => {
    const { client_email, invoiceGenerated, invoiceDate, invoiceTitle, userName } = emailData;
    const appEmail = process.env.GOOGLE_APP_EMAIL;
    const mailOptions = {
      from: `"${userName}" <${appEmail}>`,
      to: client_email,
      subject: `Facture ${invoiceDate}`,
      text: `Bonjour, voici la facture pour ${invoiceDate}, bonne réception !`,
      attachments: [
        {
          filename: `${invoiceTitle}.pdf`,
          content: invoiceGenerated,
          contentType: "application/pdf",
        },
      ],
    };
    // Send the email
    await transporter.sendMail(mailOptions);
  },

  // ------------------------------------------------------------------------------------ //
  // Return the invoice data for the database
  addInvoiceServicesToDatabase: async (servicesData, invoiceId) => {
    for (const service of servicesData) {
      const { serviceId, serviceQuantity } = service;
      const invoiceServicesData = { invoiceId, serviceId, serviceQuantity };
      await InvoiceServicesMapper.createInvoiceServices(invoiceServicesData);
    }
  },
};

module.exports = invoiceControllersMethods;
