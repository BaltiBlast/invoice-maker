const generalControllers = {
  getHome: (req, res) => {
    res.redirect("/invoice");
  },

  get404: (req, res) => {
    res.render("404", { showNavbar: true });
  },
};

module.exports = generalControllers;
