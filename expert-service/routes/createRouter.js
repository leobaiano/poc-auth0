const glob = require('glob');
const { Router } = require('express');

module.exports = () => glob
  .sync('**/*.js', { cwd: `${__dirname}/` })
  // eslint-disable-next-line global-require, import/no-dynamic-require
  .map((filename) => require(`./${filename}`))
  .filter((router) => Object.getPrototypeOf(router) === Router)
  .reduce((rootRouter, router) => rootRouter.use(router), Router({ mergeParams: true }));
