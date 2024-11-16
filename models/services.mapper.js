const CoreMapper = require("./core.mapper");

class ServicesMapper extends CoreMapper {
  tableName = "services";

  // Récupérer les services
  async getServices() {
    const records = await this.db(this.tableName).select().all();

    return records.map((record) => {
      const { id: recordId, fields: servcices } = record;
      const { ...servicesData } = servcices;
      return { ...servicesData, recordId };
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
  async updateService(data) {
    const { recordId, serviceName, servicePrice } = data;

    await this.db(this.tableName).update(recordId, {
      service_name: serviceName,
      service_price: servicePrice,
    });
  }

  // Supprimer un service
  async deleteService(recordId) {
    await this.db(this.tableName).destroy(recordId);
  }
}

module.exports = ServicesMapper;
