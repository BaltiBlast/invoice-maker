// ===== IMPORTS ===== //
const { UserMapper } = require("../../models/index.mapper");

// ===== CONTROLLERS ===== //
const profileControllers = {
  // ------------------------------------------------------------------------------------ //
  // Mapper to display the profile page
  getProfile: async (req, res) => {
    try {
      const userId = req.session.user.user_id;

      const user = await UserMapper.getUserById(userId);
      res.render("profile", { showNavbar: true, user });
    } catch (error) {
      console.error("[ERROR getProfile in profileControllers.js] :", error);
    }
  },

  // ------------------------------------------------------------------------------------ //
  // Mapper to update the user's profile
  postProfile: async (req, res) => {
    try {
      const user = req.body;
      await UserMapper.updateUser(user);
      res.redirect("/profile");
    } catch (error) {
      console.error("[ERROR postProfile in profileControllers.js] :", error);
    }
  },
};

module.exports = profileControllers;
