const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
let exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

dotenv.config();

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  }),
);

// passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// global user variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);
mongoose.connection
  .once("open", () => console.log("✅ MongoDB Connected"))
  .on("error", (error) => console.error(`❌ MongoDB Error: ${error}`));

// handlebars
const { truncate, stripTags, editIcon, select } = require("./helpers/hbs");
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { truncate, stripTags, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  }),
);
app.set("view engine", ".hbs");

// morgan — only in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Music Stories running on port ${"http://localhost:5000"}`);
});
