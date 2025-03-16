// ===== IMPORTS ===== //
const CoreMapper = require("./core.mapper");

// ===== CLIENTS MAPPER ===== //
class ClientsMapper extends CoreMapper {
  tableName = "clients";

  async getClientById(clientId) {
    const records = await this.db(this.tableName)
      .select({
        filterByFormula: `{client_id} = '${clientId}'`,
      })
      .all();

    const { fields: client, id: recordId } = records[0];
    return { ...client, recordId };
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to get clients data
  async getClients() {
    const records = await this.db(this.tableName).select().all();

    return records.map((record) => {
      const { id: recordId, fields: client } = record;
      const { ...clientData } = client;
      return { ...clientData, recordId };
    });
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to create a new client
  async createClient(data) {
    const { clientName, email, adress, city, zipCode } = data;

    await this.db(this.tableName).create([
      {
        fields: {
          client_name: clientName,
          client_email: email,
          client_adress: adress,
          client_city_name: city,
          client_zip_code: zipCode,
          client_total_payment: "0",
        },
      },
    ]);
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to update a client
  async updateClient(data) {
    const { recordId, clientName, email, adress, city, zipCode, newTotalPrice } = data;

    await this.db(this.tableName).update(recordId, {
      client_name: clientName,
      client_email: email,
      client_adress: adress,
      client_city_name: city,
      client_zip_code: zipCode,
      client_total_payment: newTotalPrice,
    });
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to delete a client
  async deleteClient(recordId) {
    await this.db(this.tableName).destroy(recordId);
  }
}

module.exports = ClientsMapper;
