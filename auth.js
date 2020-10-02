const url = require("url");
const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const md = require("marked");
const morgan = require("morgan");

module.exports = (op) => {
 
let client = op.up;

  console.log(`Callback URL: ${config.callback}`);
  passport.use(
    new Strategy(
      {
        clientID: client.user.id,
        clientSecret: op.botSecret,
        callbackURL: op.callback,
        scope: op.scope
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

  app.locals.domain = op.dominName;
  app.engine("html", require("ejs").renderFile)
   .set("view engine", "ejs")

app.use(express.static(path.join(op.public)))
		.set("views", path.join(op.view))
   
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

app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

app.get('/login', (req, res, next) => {
		if (req.session.backURL) {
			req.session.backURL = req.session.backURL;
		} else if (req.headers.referer) {
			const parsed = url.parse(req.headers.referer);
			if (parsed.hostname === app.locals.domain) {
				req.session.backURL = parsed.path;
			}
		} else {
			req.session.backURL = '/';
		}
		next();
	},
	passport.authenticate('discord'));

	app.get('/callback', passport.authenticate('discord', {
		failureRedirect: '/'
	}), (req, res) => {
		if (req.session.backURL) {
			res.redirect(req.session.backURL);
			req.session.backURL = null;
		} else {
			res.redirect('/');
		}
	});

}
