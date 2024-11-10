const authControllers = {
  postSignin: (req, res) => {},

  getSignin: (req, res) => {
    res.render("signin", { title: "Sign In" });
  },

  getDisconnect: (req, res) => {},
};

module.exports = authControllers;
