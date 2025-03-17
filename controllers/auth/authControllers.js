// ===== IMPORTS ===== //
const { UserMapper } = require("../../models/index.mapper");
const bcrypt = require("bcrypt");

// ===== CONTROLLERS ===== //
const authControllers = {
  // ------------------------------------------------------------------------------------ //
  // Method to display the sign up page
  getSignin: (req, res) => {
    res.render("signin", { showNavbar: false });
  },

  // ------------------------------------------------------------------------------------ //
  // Method to sign in a user
  postSignin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserMapper.getUserByEmail(email);
      const hashedPassword = user.password;
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordMatch) {
        const errorMessage = "Informations invalides";
        return res.render("signin", { showNavbar: false, errorMessage });
      }

      req.session.user = user;
      res.redirect("/invoice");
    } catch (error) {
      console.error("[ERROR postSignin in authControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to display the sign up page
  postSignup: async (req, res) => {
    try {
      const { lastName, firstName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserMapper.createUser({ lastName, firstName, email, password: hashedPassword });
      res.redirect("/signin");
    } catch (error) {
      console.error("[ERROR postSignup in authControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Method to sign out a user
  getDisconnect: (req, res) => {
    req.session.destroy();
    res.redirect("/signin");
  },
};

module.exports = authControllers;
