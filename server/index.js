'use strict';

const https = require('https');
const fs = require('fs');
const httpShutdown = require('http-shutdown');

/**
 * @type {Application}
 */
const app = require('./app');
const config = require('../config');

const logger = require('./logger');

const options = {
  key: fs.readFileSync(config.server.ssl.key),
  cert: fs.readFileSync(config.server.ssl.cert),
};

const nodeServer = https.createServer(options, app.callback());
const server = httpShutdown(nodeServer);

server.listen(
  config.server.port,
  config.server.host,
  () => logger.info(`SSL is up on ${ config.server.host }:${ config.server.port }`),
);

const shutDown = () => {
  logger.info('Shutdown');

  if (!server.listening) {
    return;
  }

  server.shutdown((error) => {
    if (error) {
      logger.error(error);
    }
  });
};

process.once('SIGINT', shutDown);
process.once('SIGTERM', shutDown);
