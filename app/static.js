'use strict';

/**
 * Module dependencies
 */
const restify = require('restify');
const join = require('path').join;
const ejs = require('ejs');
const fs = require('fs');

/**
 * Expose routes
 */
module.exports = function(server) {
  // static contents
  server.get(/\/public\/?.*/, restify.serveStatic({
    directory: join(__dirname, "../"),
    default: 'index.html'
  }));


  /* output as html */
  server.get(/\/output_as_html/, function(req, res, next) {
    var html = req.params.html;

    var output = fs.readFileSync( join(__dirname, "../public/preview.ejs") , 'utf8');
    var normalize = fs.readFileSync( join(__dirname, "../public/css/normalize.css"), "utf8");
    var style = fs.readFileSync( join(__dirname, "../public/css/style1.css"), "utf8");
    output = ejs.render(output, {
        html: html,
        normalize: normalize,
        style: style
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(output);
    res.end();
  });

};
