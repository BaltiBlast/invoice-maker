// ===== IMPORTS ===== //
// Models
const { ClientsMapper, ServicesMapper, UserMapper, InvoicesMapper } = require("../../models/index.mapper");

// Utils
const { months, userFullName } = require("../../utils/genericMethods");

// Controller's methods
const {
  formatingInvoiceServices,
  formatingInvoiceUserInformations,
  formatingInvoiceClientData,
  invoicePdfGenerator,
  sendInvoiceEmail,
  addInvoiceServicesToDatabase,
} = require("./invoiceControllersMethods");

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
      const { client_email } = client;

      // Get user's informations + destructure them
      const userData = req.session.user;

      // Get services informations + formating them
      const servicesInformation = await formatingInvoiceServices(servicesData);

      //  User informations for the invoice
      const userInformations = formatingInvoiceUserInformations(userData);
      const userName = userFullName(userData);

      // Client informations for the invoice
      const clientInformations = formatingInvoiceClientData(client);

      // Date for the invoice
      const invoiceYear = new Date().getFullYear();
      const invoiceDate = `${invoiceMonth} ${invoiceYear}`;

      // Invoice Number
      const invoiceNumber = "5";

      // Invoice Title
      const invoiceTitle = `Facture n°${invoiceNumber} - ${invoiceDate}`;

      // Invoice total service price
      const totalPrice = servicesInformation.reduce((sum, service) => sum + Number(service.at(-1)), 0);

      // Dynamic invoice data
      const inputs = [
        {
          invoiceTitle: invoiceTitle,
          userInformations: userInformations,
          clientInformations: clientInformations,
          servicesInformation: servicesInformation,
          totalPrice: totalPrice.toString(),
          paymentData: `Crédit Agricole\nIBAN : FR76 0000 0000 0000 0000 0000 000\nBIC / SWIFT : AGRIFRPP361`,
        },
      ];

      // Invoice pdf generation
      const invoiceGenerated = await invoicePdfGenerator(inputs);

      const emailData = { userName, client_email, invoiceDate, invoiceTitle, invoiceGenerated };

      // Send the pdf invoice by email
      await sendInvoiceEmail(emailData);

      const invoiceData = {
        invoiceMonth: invoiceMonth,
        invoiceYear: invoiceYear,
        invoiceClientId: clientId,
        userId: userData.user_id,
      };

      // Add the invoice to the database
      const invoiceId = await InvoicesMapper.addInvoice(invoiceData);

      // Add the invoice's services to the database
      await addInvoiceServicesToDatabase(servicesData, invoiceId);

      // Send the response
      res.json({ reload: true, success: true });
    } catch (error) {
      console.error("[ERROR postSendInvoiceEmail in invoiceControllers.js] :", error);
      res.json({ reload: true });
    }
  },
};

module.exports = invoiceControllers;
