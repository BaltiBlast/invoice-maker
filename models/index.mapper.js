// ===== IMPORTS ===== //
const db = require("../configs/airtable");

// ===== MODELS ===== //
const User = require("./user.mapper");
const Clients = require("./clients.mapper");
const Services = require("./services.mapper");
const Invoices = require("./invoices.mapper");
const InvoiceServices = require("./invoiceServices.mapper");

module.exports = {
  UserMapper: new User(db),
  ClientsMapper: new Clients(db),
  ServicesMapper: new Services(db),
  InvoicesMapper: new Invoices(db),
  InvoiceServicesMapper: new InvoiceServices(db),
};
