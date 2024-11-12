const { ServicesMapper } = require("../../models/index.mapper");

const servicesControllers = {
  getServices: async (req, res) => {
    try {
      const services = await ServicesMapper.getServices();
      res.render("services", { showNavbar: true, services });
    } catch (error) {
      console.log("[ERROR GETTING SERVICES] ", error);
    }
  },

  postServices: async (req, res) => {
    try {
      const servicesData = req.body;
      await ServicesMapper.createService(servicesData);
      res.redirect("/services");
    } catch (error) {
      console.log("[ERROR CREATING SERVICE] ", error);
    }
  },

  postDeleteServices: async (req, res) => {
    try {
      const { recordId } = req.body;
      await ServicesMapper.deleteService(recordId);
      res.redirect("/services");
    } catch (error) {
      console.log("[ERROR DELETING SERVICE] ", error);
    }
  },
};

module.exports = servicesControllers;
