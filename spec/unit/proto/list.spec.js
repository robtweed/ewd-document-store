'use strict';

var list = require('../../../lib/proto/list');
var dbMock = require('../mocks/db');

describe('unit/proto/list:', function () {
  var DocumentStore;
  var documentStore;
  var db;

  beforeAll(function () {
    DocumentStore = function (db) {
      this.db = db;
      this.list = list;
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
  });

  it('should return list of globals using default range', function () {
    /*jshint camelcase: false */
    documentStore.db.global_directory.and.returnValue(['rob', 'tony']);
    /*jshint camelcase: true */

    var actual = documentStore.list();

    expect(actual).toEqual(['rob', 'tony']);

    /*jshint camelcase: false */
    expect(documentStore.db.global_directory).toHaveBeenCalledWith({});
    /*jshint camelcase: true */
  });

  it('should return list of globals using customg range', function () {
    /*jshint camelcase: false */
    documentStore.db.global_directory.and.returnValue(['rob', 'tony']);
    /*jshint camelcase: true */

    var range = {max: 20};
    var actual = documentStore.list(range);

    expect(actual).toEqual(['rob', 'tony']);

    /*jshint camelcase: false */
    expect(documentStore.db.global_directory).toHaveBeenCalledWith(range);
    /*jshint camelcase: true */
  });
});
