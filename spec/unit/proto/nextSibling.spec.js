'use strict';

var nextSibling = require('../../../lib/proto/nextSibling');
var dbMock = require('../mocks/db');

describe('unit/proto/nextSibling:', function () {
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
    Object.defineProperty(proto, 'nextSibling', nextSibling);

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
    expect(nextSibling.enumerable).toBeFalsy();
  });

  it('should be not configurable', function () {
    expect(nextSibling.configurable).toBeFalsy();
  });

  it('should return next sibling node', function () {
    documentStore.db.next.and.returnValue({
      result: 'bar',
      subscripts: ['bar']
    });

    var actual = documentNode.nextSibling;

    expect(actual instanceof DocumentNode).toBeTruthy();
    expect(actual.documentName).toBe('rob');
    expect(actual.path).toEqual(['bar']);

    expect(documentStore.db.next).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo']
    });
  });

  it('should return nothing', function () {
    documentStore.db.next.and.returnValue({result: ''});

    expect(documentNode.nextSibling).toBeUndefined();
  });
});
