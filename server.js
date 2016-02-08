
'use strict';

/**
 * Module dependencies
 */
const fs = require('fs');
const join = require('path').join;
const restify = require('restify');

/**
 * App dependencies
 */
const server = restify.createServer();
const PORT = process.env.PORT || 8080

/**
 * Middleware
 */
server.use([
  restify.bodyParser(),
  restify.queryParser(),
  restify.CORS(),
  restify.fullResponse()
]);

/**
* Bootstrap routes
*/
require('./app/static')(server);
require('./app/content')(server);

/**
 * Expose server
 */
module.exports = server;
server.listen(PORT, function () {
  console.log('server listening at %s', server.url);
});
