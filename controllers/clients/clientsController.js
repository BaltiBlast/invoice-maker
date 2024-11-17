const { ClientsMapper } = require("../../models/index.mapper");
const { formatAdress } = require("../../utils/genericMethods");

const clientsController = {
  getClients: async (req, res) => {
    try {
      const clients = await ClientsMapper.getClients();

      const formattedClients = clients.map((client) => {
        const { client_adress, client_city_name, client_zip_code } = client;
        const formattedAdress = formatAdress(client_adress, client_city_name, client_zip_code);
        return { ...client, formattedAdress };
      });

      res.render("clients", { showNavbar: true, clients: formattedClients });
    } catch (error) {
      console.error("[ERROR GETTING CLIENTS] ", error);
    }
  },

  postClientAdd: async (req, res) => {
    try {
      const clientData = req.body;
      await ClientsMapper.createClient(clientData);
      res.redirect("/clients");
    } catch (error) {
      console.error("[ERROR CREATING CLIENT] ", error);
    }
  },

  postClientUpdate: async (req, res) => {
    try {
      const clientData = req.body;
      await ClientsMapper.updateClient(clientData);
      res.redirect("/clients");
    } catch (error) {
      console.error("[ERROR UPDATING CLIENT] ", error);
    }
  },

  postClientsDelete: async (req, res) => {
    try {
      const { recordId } = req.body;
      await ClientsMapper.deleteClient(recordId);
      res.redirect("/clients");
    } catch (error) {
      console.error("[ERROR DELETING CLIENT] ", error);
    }
  },
};

module.exports = clientsController;
