'use strict';

/**
 * Module dependencies
 */
const restify = require('restify');
const join = require('path').join;

/**
 * Expose routes
 */
module.exports = function(server) {
  // static contents
  server.get(/\/public\/?.*/, restify.serveStatic({
    directory: join(__dirname, "../"),
    default: 'index.html'
  }));
};
