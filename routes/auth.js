let express = require("express");
let passport = require("passport");
let router = express.Router();

// login/auth with google
// GET, route: /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google auth callback
// GET, route: /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// logout user
// GET, router: /auth/logout

router.get("/logout", (req, res, next) => {
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect("/");
  });
});

// logout functionality on google auth 2.0
// https://stackoverflow.com/questions/12909332/how-to-logout-of-an-application-where-i-used-oauth2-to-login-with-google

module.exports = router;
