require("dotenv").config();
require("./config/mongodb"); // database initial setup
require("./helpers/hbs"); // utils for hbs templates

// base dependencies
const express = require("express");
const app = express();
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const logger = require("morgan");
const hbs = require("hbs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dev_mode = false;

// config logger (pour debug)
app.use(logger("dev"));

// initial config
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());


// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }, // in millisec
    store: new MongoStore({ // la session est stockée en bdd
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    saveUninitialized: true,
    resave: true
  })
);

// below, site_url is used in partials/shop_head.hbs to perform ajax request (var instead of hardcoded)
app.locals.site_url = process.env.SITE_URL;

app.use(flash());

// CUSTOM MIDDLEWARES

if (dev_mode === true) {
  app.use(require("./middlewares/devMode")); // active le mode dev pour éviter les deconnexions
  app.use(require("./middlewares/debugSessionInfos")); // affiche le contenu de la session
}

app.use(require("./middlewares/exposeLoginStatus")); // expose le status de connexion aux templates
app.use(require("./middlewares/exposeFlashMessage")); // affiche les messages dans le template

// routers
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/dashboard"));

//Requiring the api's services
const apiSneaker = require("./services/sneaker");
const apiTag = require("./services/tag.js");
app.use("/api/sneaker/", apiSneaker.router);
app.use("/api/tag/", apiTag.router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
