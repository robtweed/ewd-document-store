'use strict';

var exists = require('../../../lib/proto/exists');
var dbMock = require('../mocks/db');

describe('unit/proto/exists:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;
    };

    var proto = DocumentNode.prototype;
    Object.defineProperty(proto, 'exists', exists);

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
    expect(exists.enumerable).toBeTruthy();
  });

  it('should be not configurable', function () {
    expect(exists.configurable).toBeFalsy();
  });

  it('should return true', function () {
    documentNode._defined = 0;

    expect(documentNode.exists).toBeFalsy();
  });

  it('should return false', function () {
    documentNode._defined = 11;

    expect(documentNode.exists).toBeTruthy();
  });
});
