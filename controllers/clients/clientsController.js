const fakeData = require("../../utils/fakeData");

const clientsController = {
  getClients: (req, res) => {
    const contacts = fakeData.contacts;
    res.render("clients", { showNavbar: true, contacts });
  },

  postClients: (req, res) => {},
};

module.exports = clientsController;
