/*!
 * Keys - MongoDB
 * Copyright(c) 2010 Vladimir Dronnikov <dronnikov@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var DB = require('mongodb/db').Db,
    Server = require("mongodb/connection").Server,
    noop = function(){};

/**
 * Initialize Mongo with the given `options`.
 *
 * Options:
 *
 *  - `dbname`     Database name
 *  - `collection` Document collection name
 *  - `port`       Optional mongod port
 *  - `host`       Optional mondod host
 *
 * @param {Object} options
 * @api public
 */

var Mongo = module.exports = function Mongo(options) {
    options = options || {};
    var self = this;
    var connection = new DB(options.dbname, new Server(options.host || '127.0.0.1', options.port || 27017, {}), {});
    connection.open(function(err, db){
        db.collection(options.collection || 'Foo', function(err, collection){
            self.client = collection;
        });
    });
};

/**
 * Set `key` to `val`, then callback `fn(err)`.
 *
 * @param {String} key
 * @param {String} val
 * @param {Function} fn
 * @api public
 */

Mongo.prototype.set = function(key, doc, fn){
    doc._id = key;
    this.client.update({_id: key}, doc, {upsert: true}, fn || noop);
};

/**
 * Get `key`, then callback `fn(err, val)`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

Mongo.prototype.get = function(key, fn){
    this.client.findOne({_id: key}, fn);
};

/**
 * Remove `key`, then callback `fn(err)`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

Mongo.prototype.remove = function(key, fn){
    this.client.remove({_id: key}, fn);
};

/**
 * Check if `key` exists, callback `fn(err, exists)`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

Mongo.prototype.has = function(key, fn){
    this.client.findOne({_id: key}, function(err, exists){
        fn(err, !!exists);
    });
};

/**
 * Fetch number of keys, callback `fn(err, len)`.
 *
 * @param {Function} fn
 * @api public
 */

Mongo.prototype.length = function(fn){
    this.client.count({}, fn);
};

/**
 * Clear all keys, then callback `fn(err)`.
 *
 * @param {Function} fn
 * @api public
 */

Mongo.prototype.clear = function(fn){
    this.client.drop(fn || noop);
};

/**
 * Iterate with `fn(val, key)`, then `done()` when finished.
 *
 * @param {Function} fn
 * @param {Function} done
 * @api public
 */

Mongo.prototype.each = function(fn, done){
    var self = this;
    this.client.find({}, function(err, cursor){
        if (err) {
            done && done(err);
            return;
        }
        function one(err, doc){
            if (err || !doc) {
                done && done(err);
                return;
            }
            fn(doc._id, doc);
            cursor.nextObject(one);
        }
        cursor.nextObject(one);
    });
};
