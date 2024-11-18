// ===== CONTROLLERS ===== //
const generalControllers = {
  // ------------------------------------------------------------------------------------ //
  // Method to display the home page
  getHome: (req, res) => {
    res.redirect("/invoice");
  },

  // ------------------------------------------------------------------------------------ //
  // Method to display the 404 page
  get404: (req, res) => {
    res.render("404", { showNavbar: true });
  },
};

module.exports = generalControllers;
