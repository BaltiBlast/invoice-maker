const { InvoicesMapper } = require("../../models/index.mapper");

const summaryControllers = {
  getSummary: async (req, res) => {
    try {
      const invoicesSummary = await InvoicesMapper.getInvoices();
      const formatedInvoicesSummary = [];
      const URSSAF_RATE = 0.2552;

      invoicesSummary.forEach((invoice) => {
        const invoiceIncome = parseFloat(invoice.invoice_incomes) || 0;

        let yearGroup = formatedInvoicesSummary.find((group) => group.invoice_year === invoice.invoice_year);
        if (!yearGroup) {
          yearGroup = {
            invoice_year: invoice.invoice_year,
            invoice_months: [],
            totalIncome: 0,
            totalURSSAF: 0,
          };
          formatedInvoicesSummary.push(yearGroup);
        }

        let monthGroup = yearGroup.invoice_months.find((month) => month.month === invoice.invoice_month);
        if (!monthGroup) {
          monthGroup = {
            month: invoice.invoice_month,
            totalIncome: 0,
            URSSAF: 0,
          };
          yearGroup.invoice_months.push(monthGroup);
        }

        monthGroup.totalIncome += invoiceIncome;
        monthGroup.totalIncome = parseFloat(monthGroup.totalIncome.toFixed(2));
        monthGroup.URSSAF = parseFloat((monthGroup.totalIncome * URSSAF_RATE).toFixed(2));

        yearGroup.totalIncome = parseFloat(
          yearGroup.invoice_months.reduce((sum, m) => sum + m.totalIncome, 0).toFixed(2)
        );
        yearGroup.totalURSSAF = parseFloat(yearGroup.invoice_months.reduce((sum, m) => sum + m.URSSAF, 0).toFixed(2));
      });

      res.render("summary", { showNavbar: true, formatedInvoicesSummary });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = summaryControllers;
