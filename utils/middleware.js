const middleware = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    res.redirect("/signin");
  },
};

module.exports = middleware;
