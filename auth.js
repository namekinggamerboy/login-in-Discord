const url = require("url");
const http = require("http");
const path = require("path");
const Discord = require("discord.js");
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const md = require("marked");
const morgan = require("morgan");
const config = require("./config.json");

module.exports = client => {
  if ("true" !== "true") return console.log("log", "Dashboard disabled", "INFO");
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

 /* app.set("trust proxy", 5);
  app.use(
    "/public",
    express.static(path.resolve(`${dataDir}${path.sep}public`), {
      maxAge: "10d"
    })
  );
  app.use(morgan("combined")); // Logger

  // uhhhh check what these do.
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });*/
 
/*
 var protocol;

  if ("true" === "true") {
    client.protocol = "https://";
  } else {
    client.protocol = "http://";
  }

  protocol = client.protocol;
*/
  
  console.log(`Callback URL: ${config.callback}`);
  passport.use(
    new Strategy(
      {
        clientID: config.botid,
        clientSecret: config.botsecret,
        callbackURL: config.callback,
        scope: ["identify", "guilds"]
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );
  app.use(
    session({
      secret: config.botcode,
      resave: false,
      saveUninitialized: false
    })
  );

  // Initializes passport and session.
  app.use(passport.initialize());
  app.use(passport.session());

  // The domain name used in various endpoints to link between pages.
  app.locals.domain = "me-royal-plus.glitch.me";

  // The EJS templating engine gives us more power
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");

  // body-parser reads incoming JSON or FORM data and simplifies their
  // use in code.
  var bodyParser = require("body-parser");
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true
    })
  );

  /*
	Authentication Checks. checkAuth verifies regular authentication,
	whereas checkAdmin verifies the bot owner. Those are used in url
	endpoints to give specific permissions.
	*/
  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  function cAuth(req, res) {
    if (req.isAuthenticated()) return;
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.id === "596521432507219980")
      return next();
    req.session.backURL = req.originalURL;
    res.redirect("/");
  }
