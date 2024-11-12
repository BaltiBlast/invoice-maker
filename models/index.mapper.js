const db = require("../configs/airtable");

const User = require("./user.mapper");
const Clients = require("./clients.mapper");
const Services = require("./services.mapper");

module.exports = {
  UserMapper: new User(db),
  ClientsMapper: new Clients(db),
  ServicesMapper: new Services(db),
};
