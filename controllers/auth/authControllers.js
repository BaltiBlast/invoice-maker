const { UserMapper } = require("../../models/index.mapper");
const bcrypt = require("bcrypt");

const authControllers = {
  getSignin: (req, res) => {
    res.render("signin", { showNavbar: false });
  },

  postSignin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await UserMapper.getUser();
      const hashedPassword = user.password;
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordMatch) {
        const errorMessage = "Informations invalides";
        return res.render("signin", { showNavbar: false, errorMessage });
      }

      req.session.user = user;
      res.redirect("/invoice");
    } catch (error) {}
  },

  getDisconnect: (req, res) => {
    req.session.destroy();
    res.redirect("/signin");
  },
};

module.exports = authControllers;
