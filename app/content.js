'use strict';

/**
* Module dependencies
*/
const restify = require('restify');
const ex = require('./lib/extracter.js');

/**
* Expose routes
*/
module.exports = function(server) {
  server.get('/content', function(req, res, next) {
    var url = req.params.url

    ex(url, function(err, result) {
        res.send(result);
        return next();
    });
  })
}
