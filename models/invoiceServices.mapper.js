// ===== IMPORTS ===== //
const CoreMapper = require("./core.mapper");

// ===== INVOICES MAPPER ===== //
class InvoiceServices extends CoreMapper {
  tableName = "invoice_services";

  // ------------------------------------------------------------------------------------ //
  // Mapper to get all invoice's services
  async getInvoiceServices(invoiceId) {
    const records = await this.db(this.tableName)
      .select({
        filterByFormula: `{invoice_id} = '${invoiceId}'`,
      })
      .all();

    return records.map((record) => {
      const { fields: invoiceServcices } = record;
      const { ...invoiceServicesData } = invoiceServcices;
      return { ...invoiceServicesData };
    });
  }

  // ------------------------------------------------------------------------------------ //
  // Mapper to create an invoice services
  async createInvoiceServices(invoiceServicesData) {
    const { invoiceId, serviceId, serviceQuantity } = invoiceServicesData;

    await this.db(this.tableName).create([
      {
        fields: {
          invoice_id: invoiceId,
          service_id: serviceId,
          service_quantity: serviceQuantity,
        },
      },
    ]);
  }
}

module.exports = InvoiceServices;
