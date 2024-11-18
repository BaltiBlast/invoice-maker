const CoreMapper = require("./core.mapper");

class InvoicesMapper extends CoreMapper {
  tableName = "invoices";

  // Récupérer les factures
  async getInvoices() {
    const records = await this.db(this.tableName).select().all();

    return records.map((record) => {
      const { id: recordId, fields: invoice } = record;
      const { ...invoiceData } = invoice;
      return { ...invoiceData, recordId };
    });
  }

  // Créer un client
  async addInvoice(data) {
    const { invoiceMonth, invoiceYear, invoiceIncome, invoiceClientId } = data;

    await this.db(this.tableName).create([
      {
        fields: {
          invoice_month: invoiceMonth,
          invoice_year: invoiceYear,
          invoice_incomes: invoiceIncome,
          invoice_client_id: invoiceClientId,
        },
      },
    ]);
  }
}

module.exports = InvoicesMapper;
