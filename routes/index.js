const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/story");

// FIX: Usunięto zbędny `const app = express()` — router nie potrzebuje własnej instancji express

// login/home page
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      lastname: req.user.lastName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
  // FIX: Usunięto console.log(req.user) — logował dane osobowe użytkownika do konsoli serwera
});

module.exports = router;
