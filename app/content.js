'use strict';

/**
* Module dependencies
*/
const restify = require('restify');
const ex = require('./lib/extracter.js');
const phantom = require('phantom');

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

  server.get('/capture', function(req, res, next) {
    var url = req.params.url;
    var top = req.params.top;
    var left = req.params.left;
    var width = req.params.width;
    var height = req.params.height;

    console.log(url, top, left, width, height);

    webCapB64(url, top, left, width, height, function(b64) {
      res.send(b64);
      return next();
    });
  })
}


function webCapB64(url, top, left, width, height, cb){
  phantom.create(function(ph){
    ph.createPage(function(page){
      page.set('clipRect', {top: top, left: left, width: width, height: height});
      //page.viewportSize = { width: 480, height: 800 };
      page.open(url,function(status){
        console.log("opened", status);
        page.renderBase64('PNG', function(b64){
          ph.exit();
          cb(b64);
        });
      });
    });
  });
}



