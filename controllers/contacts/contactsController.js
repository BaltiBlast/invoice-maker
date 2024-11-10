const contactsController = {
  getContacts: (req, res) => {
    res.render("contacts", { showNavbar: true });
  },

  postContacts: (req, res) => {},
};

module.exports = contactsController;
