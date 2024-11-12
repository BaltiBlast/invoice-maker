const CoreMapper = require("./core.mapper");

class ServicesMapper extends CoreMapper {
  tableName = "services";

  // Récupérer les services
  async getServices() {
    const records = await this.db(this.tableName).select().all();

    return records.map((record) => {
      const { id: recordId, fields: user } = record;
      const { ...userData } = user;
      return { ...userData, recordId };
    });
  }

  // Créer un service
  async createService(data) {
    const { serviceName, servicePrice } = data;

    await this.db(this.tableName).create([
      {
        fields: {
          service_name: serviceName,
          service_price: servicePrice,
        },
      },
    ]);
  }

  // Mettre à jour un service
  async updateService() {}

  // Supprimer un service
  async deleteService(recordId) {
    await this.db(this.tableName).destroy(recordId);
  }
}

module.exports = ServicesMapper;
