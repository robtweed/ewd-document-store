'use strict';

var lastChild = require('../../../lib/proto/lastChild');
var dbMock = require('../mocks/db');

describe('unit/proto/lastChild:', function () {
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
    Object.defineProperty(proto, 'lastChild', lastChild);

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
    expect(lastChild.enumerable).toBeFalsy();
  });

  it('should be not configurable', function () {
    expect(lastChild.configurable).toBeFalsy();
  });

  it('should return lastChild', function () {
    documentStore.db.previous.and.returnValue({
      result: 'baz',
      subscripts: ['baz']
    });

    var actual = documentNode.lastChild;

    expect(actual instanceof DocumentNode).toBeTruthy();
    expect(documentNode.$baz).toBe(actual);

    expect(documentStore.db.previous).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo', 'bar', '']
    });
  });
});
