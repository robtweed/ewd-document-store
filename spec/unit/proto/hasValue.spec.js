'use strict';

var hasValue = require('../../../lib/proto/hasValue');
var dbMock = require('../mocks/db');

describe('unit/proto/hasValue:', function () {
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
    Object.defineProperty(proto, 'hasValue', hasValue);

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
    expect(hasValue.enumerable).toBeTruthy();
  });

  it('should be not configurable', function () {
    expect(hasValue.configurable).toBeFalsy();
  });

  it('should return true when node contains data but has no subnodes', function () {
    documentNode._defined = 1;

    expect(documentNode.hasValue).toBeTruthy();
  });

  it('should return true when node contains data and has subnodes', function () {
    documentNode._defined = 11;

    expect(documentNode.hasValue).toBeTruthy();
  });

  it('should return false', function () {
    expect(documentNode.hasValue).toBeFalsy();
  });
});
