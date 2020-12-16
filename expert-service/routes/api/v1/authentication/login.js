const { Router } = require('express');
const passport = require('passport');

module.exports = Router({ mergeParams: true })
  .get(`/${process.env.EXERT_SERVICE_API_VERSION}/login`, passport.authenticate('auth0', {
    scope: 'openid email profile',
  }), (req, res) => {
    res.redirect('/');
  });
