'use strict';

var parent = require('../../../lib/proto/parent');
var dbMock = require('../mocks/db');

describe('unit/proto/parent:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore, documentName, subs) {
      this.documentStore = documentStore;
      this.documentName = documentName;
      this.path = subs || [];
      this.name = this.path.length > 0 ?
        this.path[this.path.length - 1] :
        this.documentName;
    };

    var proto = DocumentNode.prototype;
    Object.defineProperty(proto, 'parent', parent);

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode('rob', ['foo', 'bar']);
  });

  it('should be enumerable', function () {
    expect(parent.enumerable).toBeFalsy();
  });

  it('should be not configurable', function () {
    expect(parent.configurable).toBeFalsy();
  });

  it('should return parent node', function () {
    var actual = documentNode.parent;

    expect(actual instanceof DocumentNode).toBeTruthy();
    expect(actual.documentName).toBe('rob');
    expect(actual.path).toEqual(['foo']);
    expect(actual.$bar).toBe(documentNode);
  });

  it('should return nothing', function () {
    documentNode = new documentStore.DocumentNode('rob');

    expect(documentNode.parent).toBeUndefined();
  });
});
