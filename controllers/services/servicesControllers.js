// ===== IMPORTS ===== //
const { ServicesMapper } = require("../../models/index.mapper");

// ===== CONTROLLERS ===== //
const servicesControllers = {
  // ------------------------------------------------------------------------------------ //
  // Method to display the services page
  getServices: async (req, res) => {
    try {
      const userId = req.session.user.user_id;
      const services = await ServicesMapper.getUserServices(userId);
      res.render("services", { showNavbar: true, services, userId });
    } catch (error) {
      console.error("[ERROR getServices in servicesControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to create a new service
  postServicesAdd: async (req, res) => {
    try {
      const servicesData = req.body;
      await ServicesMapper.createService(servicesData);
      res.redirect("/services");
    } catch (error) {
      console.error("[ERROR postServicesAdd in servicesControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to update a service
  postServicesUpdate: async (req, res) => {
    try {
      const servicesData = req.body;
      await ServicesMapper.updateService(servicesData);
      res.redirect("/services");
    } catch (error) {
      console.error("[ERROR postServicesUpdate in servicesControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to delete a service
  postServiceDelete: async (req, res) => {
    try {
      const { recordId } = req.body;
      await ServicesMapper.deleteService(recordId);
      res.redirect("/services");
    } catch (error) {
      console.error("[ERROR postServiceDelete in servicesControllers.js] :", error);
    }
  },
};

module.exports = servicesControllers;
