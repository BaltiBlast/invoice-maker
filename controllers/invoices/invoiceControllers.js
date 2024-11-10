const invoiceControllers = {
  getInvoice: (req, res) => {
    res.render("invoice", { showNavbar: true });
  },

  postInvoice: (req, res) => {},
};

module.exports = invoiceControllers;
