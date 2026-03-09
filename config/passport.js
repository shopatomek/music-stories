const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

// FIX: Usunięto błędny `const config = require("/.env")`
// Ścieżka "/.env" (z wiodącym /) oznacza korzeń systemu plików — plik tam nie istnieje.
// process.env.* działa poprawnie bo dotenv.config() jest wywołane w index.js przed tym modułem.

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // FIX: callbackURL musi być pełnym URL na produkcji
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // FIX: Usunięto console.log(profile) — logował dane osobowe użytkownika (PII)
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // FIX: użycie async/await zamiast callback (deprecated w nowych wersjach Mongoose)
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
