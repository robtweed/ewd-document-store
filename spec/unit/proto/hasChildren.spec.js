'use strict';

var hasChildren = require('../../../lib/proto/hasChildren');
var dbMock = require('../mocks/db');

describe('unit/proto/hasChildren:', function () {
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
    Object.defineProperty(proto, 'hasChildren', hasChildren);

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
    expect(hasChildren.enumerable).toBeTruthy();
  });

  it('should be not configurable', function () {
    expect(hasChildren.configurable).toBeFalsy();
  });

  it('should return true when node does not contain data but has subnodes', function () {
    documentNode._defined = 10;

    expect(documentNode.hasChildren).toBeTruthy();
  });

  it('should return true when node contains data and has subnodes', function () {
    documentNode._defined = 11;

    expect(documentNode.hasChildren).toBeTruthy();
  });

  it('should return false', function () {
    expect(documentNode.hasChildren).toBeFalsy();
  });
});
