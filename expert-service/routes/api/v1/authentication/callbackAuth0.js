const { Router } = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv-safe').config();
// const jwt = require('jsonwebtoken');

// Configure Passport Strategy to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
    process.env.AUTH0_CALLBACK_URL || `${process.env.EXPERT_SERVICE_BASE_URL}:${process.env.EXPERT_SERVICE_PORT}/api/${process.env.EXPERT_SERVICCE_API_VERSION}/`,
  },
  ((accessToken, refreshToken, extraParams, profile, done) => done(null, profile)),
);

passport.use(strategy);

module.exports = Router({ mergeParams: true })
  .use(passport.initialize())
  .use(passport.session())
  .get(`/${process.env.EXERT_SERVICE_API_VERSION}/callback`, (req, res, next) => {
    // eslint-disable-next-line consistent-return, no-unused-vars
    passport.authenticate('auth0', (err, user, info) => {
      // If there is an authentication error
      if (err) { return next(err); }

      // If the user data is not returned
      if (!user) { return res.redirect(`/api/${process.env.EXERT_SERVICE_API_VERSION}/login`); }

      // eslint-disable-next-line no-shadow, consistent-return
      req.logIn(user, (err) => {
        // If there is an authentication error
        if (err) { return next(err); }

        const { returnTo } = req.session;

        delete req.session.returnTo;

        // Login to generate JWT token
        // eslint-disable-next-line no-underscore-dangle
        // const token = jwt.sign(user,
        //   process.env.AUTH0_CLIENT_SECRET, { expiresIn: 36000 });

        res.redirect(returnTo || '/api/v1/users');
      });
    })(req, res, next);
  });
