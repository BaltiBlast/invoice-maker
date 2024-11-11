const User = require("./user.mapper");
const Clients = require("./clients.mapper");
const Services = require("./services.mapper");

module.exports = {
  UserMapper: new User(),
  ContactsMapper: new Clients(),
  ServicesMapper: new Services(),
};
