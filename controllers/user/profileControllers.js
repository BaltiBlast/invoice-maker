const { UserMapper } = require("../../models/index.mapper");

const profileControllers = {
  getProfile: async (req, res) => {
    try {
      const user = await UserMapper.getUser();
      res.render("profile", { showNavbar: true, user });
    } catch (error) {
      console.log("[ERROR GETTING PROFILE] ", error);
    }
  },

  postProfile: async (req, res) => {
    try {
      const user = req.body;
      await UserMapper.updateUser(user);
      res.redirect("/profile");
    } catch (error) {
      console.log("[ERROR UPDATING USER PROFILE] ", error);
    }
  },
};

module.exports = profileControllers;
