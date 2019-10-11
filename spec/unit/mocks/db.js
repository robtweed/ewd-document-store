'use strict';

module.exports = {
  mock: function () {
    var db = {
      order: jasmine.createSpy(),
      increment: jasmine.createSpy(),
      data: jasmine.createSpy(),
      previous: jasmine.createSpy(),
      kill: jasmine.createSpy(),
      next: jasmine.createSpy(),
      get: jasmine.createSpy(),
      set: jasmine.createSpy(),
      version: jasmine.createSpy(),
      lock: jasmine.createSpy(),
      unlock: jasmine.createSpy(),

      /*jshint camelcase: false */
      global_directory: jasmine.createSpy(),
      next_node: jasmine.createSpy()
      /*jshint camelcase: true */
    };

    return db;
  }
};
