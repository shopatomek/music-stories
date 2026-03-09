module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
// this module is middleware made and user for protecting routes. So we can't change endpoints.
// ex1. if you're in dashbords after being logged via google you can't change endpoint access to index page. You have to logout !
// ex2. if you're in the index page you can't access dashboard pages without loggin in !
