const port = process.env.PORT || 8080;
const logger = require('./logger.js');
const database = require('./expert-service/database/createDatabase.js')({ logger });
const app = require('./expert-service/createExpressApp.js')({ logger, database });
// eslint-disable-next-line import/order
const server = require('http').createServer();
require('dotenv-safe').config();

server
  .on('request', app)
  // eslint-disable-next-line func-names
  .on('listening', function () {
    const addr = this.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`);
  })
  // eslint-disable-next-line func-names
  .on('error', function (error) {
    if (error.syscall !== 'listen') throw error;
    const addr = this.address() || { port };
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  })
  .listen(port);
