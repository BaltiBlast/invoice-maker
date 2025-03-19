// ===== IMPORTS ===== //
const CoreMapper = require("./core.mapper");

// ===== SERVICES MAPPER ===== //
class ServicesMapper extends CoreMapper {
  tableName = "services";

  // ------------------------------------------------------------------------------------ //
  // Mapper to get all services
  async getUserServices(userId) {
    const records = await this.db(this.tableName)
      .select({
        filterByFormula: `{user_id} = '${userId}'`,
      })
      .all();

    return records.map((record) => {
      const { id: recordId, fields: servcices } = record;
      const { ...servicesData } = servcices;
      return { ...servicesData, recordId };
    });
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to get service by id
  async getServiceById(serviceId) {
    const records = await this.db(this.tableName)
      .select({
        filterByFormula: `{service_id} = '${serviceId}'`,
      })
      .all();

    return records.map((record) => {
      const { id: recordId, fields: servcices } = record;
      const { ...servicesData } = servcices;
      return { ...servicesData, recordId };
    });
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to create a service
  async createService(data) {
    const { serviceName, servicePrice, userId } = data;

    await this.db(this.tableName).create([
      {
        fields: {
          service_name: serviceName,
          service_price: servicePrice,
          user_id: userId,
        },
      },
    ]);
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to update a service
  async updateService(data) {
    const { recordId, serviceName, servicePrice } = data;

    await this.db(this.tableName).update(recordId, {
      service_name: serviceName,
      service_price: servicePrice,
    });
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to delete a service
  async deleteService(recordId) {
    await this.db(this.tableName).destroy(recordId);
  }
}

module.exports = ServicesMapper;
