const { ClientsMapper } = require("../../models/index.mapper");
const { formatAdress } = require("../../utils/genericMethods");

const clientsController = {
  getClients: async (req, res) => {
    try {
      const clients = await ClientsMapper.getClients();
      const formattedClients = clients.map((contact) => {
        const { client_adress, client_city_name, client_zip_code, ...newContact } = contact;
        const formattedAdress = formatAdress(client_adress, client_city_name, client_zip_code);
        return { ...newContact, formattedAdress };
      });

      res.render("clients", { showNavbar: true, clients: formattedClients });
    } catch (error) {
      console.log("[ERROR GETTING CLIENTS] ", error);
    }
  },

  postClients: async (req, res) => {
    try {
      const clientData = req.body;
      await ClientsMapper.createClient(clientData);
      res.redirect("/clients");
    } catch (error) {
      console.log("[ERROR CREATING CLIENT] ", error);
    }
  },

  postClientsDelete: async (req, res) => {
    try {
      const { recordId } = req.body;
      await ClientsMapper.deleteClient(recordId);
      res.redirect("/clients");
    } catch (error) {
      console.log("[ERROR DELETING CLIENT] ", error);
    }
  },
};

module.exports = clientsController;
