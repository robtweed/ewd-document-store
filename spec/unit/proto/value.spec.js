'use strict';

var value = require('../../../lib/proto/value');
var dbMock = require('../mocks/db');

describe('unit/proto/value:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;
      this._set = jasmine.createSpy();
      this._node = {
        global: 'rob',
        subscripts: ['address']
      };
    };

    var proto = DocumentNode.prototype;
    Object.defineProperty(proto, 'value', value);

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode();
  });

  it('should be enumerable', function () {
    expect(value.enumerable).toBeTruthy();
  });

  it('should be not configurable', function () {
    expect(value.configurable).toBeFalsy();
  });

  it('should get value', function () {
    documentStore.db.get.and.returnValues({data: 'foo'}, {data: 'true'}, {data: 'false'});

    expect(documentNode.value).toBe('foo');
    expect(documentNode.value).toBeTruthy();
    expect(documentNode.value).toBeFalsy();
  });

  it('should set value', function () {

    documentNode.value = 'bar';

    expect(documentNode._set).toHaveBeenCalledWith('bar');
  });
});
