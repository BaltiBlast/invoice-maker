const fakeData = require("../../utils/fakeData");

const servicesControllers = {
  getServices: (req, res) => {
    const services = fakeData.services;
    res.render("services", { showNavbar: true, services });
  },
};

module.exports = servicesControllers;
