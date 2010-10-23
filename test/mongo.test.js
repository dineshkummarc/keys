
/**
 * Module dependencies.
 */

var helpers = require('./helpers'),
    Mongo = require('keys').Mongo;

var store = new Mongo;
helpers.test(exports, store, function(){
    store.client.end();
});