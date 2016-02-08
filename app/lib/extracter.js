var request = require('request');
var Promise = require('bluebird');
var jschardet = require('jschardet');
var jsdom = require('jsdom').jsdom;
var jconv = require('jconv');
var ImageResolver = require('image-resolver');
var ex = require('./extract-content');

Promise.promisifyAll(request);

module.exports = function(url, callback){
    Promise.resolve().then(function(){
        return Promise.all([getTextContent(url), getImageContent(url)]);
    })
    .spread(function(text, image){
        callback(null, {
            title: text[0],
            content: text[1],
            pic: image
        });
    }).catch(function(err){
        callback(err, null);
    });
}


function getTextContent(url){
    console.time('text');
    return request.getAsync({url: url, encoding: null})
    .spread(function(res, body){
        switch(jschardet.detect(body).encoding){
            case 'EUC-JP':
                body = jconv.convert(body, 'EUCJP', 'UTF8' ); break;
            case 'SHIFT_JIS':
                body = jconv.convert(body, 'SJIS', 'UTF8' ); break;
        }

        ex.addHandler(ex.factory.getHandler('Heuristics'));

        // DOMを抽出
        var doc = jsdom(body.toString());
        var window = doc.defaultView;
        var response;
        try{
            response = ex.extract(window.document);
        }catch(e){
            console.error('err', e);
            res = {isSuccess: false};
        }
        window.close();
        console.timeEnd('text');
        if(response.isSuccess){ // 本文取得に成功したら本文を返す
            return Promise.resolve([response.title, response.content.toString()]);
        } else {
            return Promise.reject(new Error('extracting content failed'));
        }
    }).catch(function(err){
        console.timeEnd('text');

        console.error(err);
        return Promise.resolve('');
    });
}

function getImageContent(url){
    console.time('image');
    var resolver = new ImageResolver();
    resolver.register(new ImageResolver.FileExtension());
    resolver.register(new ImageResolver.MimeType());
    resolver.register(new ImageResolver.Opengraph());
    resolver.register(new ImageResolver.Webpage());

    return new Promise(function(resolve, reject){
        resolver.resolve( url, function( result ){
            console.timeEnd('image');
            if ( result ) {
                resolve(result.image);
            } else {
                resolve();
            }
        });
    });
}
