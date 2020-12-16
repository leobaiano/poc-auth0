const { Router } = require('express');
const util = require('util');
const url = require('url');
const querystring = require('querystring');
require('dotenv-safe').config();

module.exports = Router({ mergeParams: true })
  .get(`/${process.env.EXERT_SERVICE_API_VERSION}/logout`, (req, res) => {
    req.logout();

    const returnTo = `${process.env.EXPERT_SERVICE_BASE_URL}:${process.env.EXPERT_SERVICE_PORT}/api/${process.env.EXPERT_SERVICCE_API_VERSION}/login`;

    const logoutURL = new url.URL(
      util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN),
    );

    const searchString = querystring.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo,
    });

    logoutURL.search = searchString;

    res.redirect(logoutURL);
  });
