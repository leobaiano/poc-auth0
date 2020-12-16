const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressWinston = require('express-winston');
// eslint-disable-next-line import/order
const router = require('./routes/createRouter.js')();
// eslint-disable-next-line import/order
const session = require('express-session');
require('dotenv-safe').config();
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const sess = {
  secret: process.env.EXPERT_SERVICE_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
    process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/api/v1/callback',
  },
  ((accessToken, refreshToken, extraParams, profile, done) =>
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    // eslint-disable-next-line implicit-arrow-linebreak
    done(null, profile)
  ),
);

passport.use(strategy);

module.exports = ({ database, logger }) => express()
  .use(expressWinston.logger({
    winstonInstance: logger,
    msg: '{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
    meta: false,
  }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors('*'))
  .use(session(sess))
  .use((req, res, next) => {
    req.base = `${req.protocol}://${req.get('host')}`;
    req.logger = logger;
    req.db = database;
    return next();
  })
  .use(express.static('./public'))
  .use('/api', router)
  .use(passport.initialize())
  .use(passport.session())
  // eslint-disable-next-line no-unused-vars
  .use((error, req, res, next) => {
    logger.error(error, error);
    res.status(error.status || 500).json({ error });
  });

// You can use this section to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
