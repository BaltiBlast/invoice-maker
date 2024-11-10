const userControllers = {
  postUser: (req, res) => {},

  getUser: (req, res) => {
    res.render("profile", { showNavbar: true });
  },
};

module.exports = userControllers;
