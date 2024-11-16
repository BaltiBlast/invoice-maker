const { ClientsMapper, ServicesMapper, UserMapper } = require("../../models/index.mapper");
const { allMonths } = require("../../utils/genericMethods");

const invoiceControllers = {
  getInvoice: async (req, res) => {
    try {
      const clients = await ClientsMapper.getClients();
      const services = await ServicesMapper.getServices();
      const months = allMonths;
      const user = await UserMapper.getUser();

      res.render("invoice", { showNavbar: true, clients, services, months, user });
    } catch (error) {
      console.error("[ERROR GETTING INVOICE] ", error);
    }
  },
};

module.exports = invoiceControllers;
