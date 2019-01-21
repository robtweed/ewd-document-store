'use strict';

function initCacheDb() {
  var Cache = require('cache').Cache;
  var db = new Cache();

  var openFn = db.open;
  var options = {
    path: process.env.CACHE_MGR_PATH || '/opt/cache/mgr',
    username: process.env.CACHE_USERNAME || '_SYSTEM',
    password: process.env.CACHE_PASSWORD || 'SYS',
    namespace: process.env.CACHE_NAMESPACE || 'USER'
  };

  db.open = function () {
    openFn.call(db, options);
  };

  return db;
}

function initGtmDb() {
  var Gtm = require('nodem').Gtm;
  var db = new Gtm();


  var openFn = db.open;
  var options = {
    mode: 'strict',
    charset: 'utf-8'
  };

  db.open = function () {
    openFn.call(db, options);
  };

  return db;
}

function initRedisDb() {
  /*jshint camelcase: false */
  var Redis = require('ewd-redis-globals');
  var db = new Redis({
    key_separator: ':',
    integer_padding: 10
  });
  /*jshint camelcase: true */

  return db;
}

function initMemoryDb() {
  /*jshint camelcase: false */
  var Memory = require('ewd-memory-globals');
  var db = new Memory({
    key_separator: ':',
    integer_padding: 10
  });
  /*jshint camelcase: true */

  return db;
}

module.exports = function () {
  switch (process.env.DATABASE) {
    case 'cache':
      return initCacheDb();

    case 'gtm':
      return initGtmDb();

    case 'redis':
      return initRedisDb();

    case 'memory':
      return initMemoryDb();

    default:
      return initMemoryDb();
  }
};
