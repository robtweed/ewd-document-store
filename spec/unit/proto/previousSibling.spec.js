'use strict';

var previousSibling = require('../../../lib/proto/previousSibling');
var dbMock = require('../mocks/db');

describe('unit/proto/previousSibling:', function () {
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
    };

    var proto = DocumentNode.prototype;
    Object.defineProperty(proto, 'previousSibling', previousSibling);

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode('rob', ['foo']);
  });

  it('should be enumerable', function () {
    expect(previousSibling.enumerable).toBeFalsy();
  });

  it('should be not configurable', function () {
    expect(previousSibling.configurable).toBeFalsy();
  });

  it('should return previous sibling node', function () {
    documentStore.db.previous.and.returnValue({
      result: 'baz',
      subscripts: ['baz']
    });

    var actual = documentNode.previousSibling;

    expect(actual instanceof DocumentNode).toBeTruthy();
    expect(actual.documentName).toBe('rob');
    expect(actual.path).toEqual(['baz']);

    expect(documentStore.db.previous).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo']
    });
  });

  it('should return nothing', function () {
    documentStore.db.previous.and.returnValue({result: ''});

    expect(documentNode.previousSibling).toBeUndefined();
  });
});
