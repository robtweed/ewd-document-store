'use strict';

var lock = require('../../../lib/proto/lock');
var dbMock = require('../mocks/db');

describe('unit/proto/lock:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;

      this.documentName = 'rob';
      this.path = ['foo'];
      this._node = {
        global: 'rob',
        subscripts: ['foo']
      };

      this.lock = lock;
    };

    DocumentStore = function (db) {
      this.db = db;
      this.emit = jasmine.createSpy();
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode();
  });

  it('should return true', function () {
    documentStore.db.lock.and.returnValue({result: '1'});

    var actual = documentNode.lock(600);

    expect(actual).toBeTruthy();

    expect(documentStore.db.lock).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo']
    }, 600);
  });

  it('should return false', function () {
    documentStore.db.lock.and.returnValue({result: ''});

    var actual = documentNode.lock(600);

    expect(actual).toBeFalsy();

    expect(documentStore.db.lock).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo']
    }, 600);
  });
});
