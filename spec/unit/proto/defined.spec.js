'use strict';

var defined = require('../../../lib/proto/defined');
var dbMock = require('../mocks/db');

describe('unit/proto/defined:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;
      this._node = {
        global: 'rob',
        subscripts: ['address']
      };
    };

    var proto = DocumentNode.prototype;
    Object.defineProperty(proto, '_defined', defined);

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
    expect(defined.enumerable).toBeTruthy();
  });

  it('should be not configurable', function () {
    expect(defined.configurable).toBeFalsy();
  });

  it('should return node does not exist', function () {
    documentStore.db.data.and.returnValue({});

    expect(documentNode._defined).toBe(0);
    expect(documentStore.db.data).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['address']
    });
  });

  it('should return node existence value', function () {
    documentStore.db.data.and.returnValue({defined: 1});

    expect(documentNode._defined).toBe(1);
    expect(documentStore.db.data).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['address']
    });
  });
});
