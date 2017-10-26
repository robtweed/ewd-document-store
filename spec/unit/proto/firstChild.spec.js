'use strict';

var firstChild = require('../../../lib/proto/firstChild');
var dbMock = require('../mocks/db');

describe('unit/proto/firstChild:', function () {
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
    Object.defineProperty(proto, 'firstChild', firstChild);

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
    expect(firstChild.enumerable).toBeFalsy();
  });

  it('should be not configurable', function () {
    expect(firstChild.configurable).toBeFalsy();
  });

  it('should return firstChild', function () {
    documentStore.db.order.and.returnValue({
      result: 'baz',
      subscripts: ['baz']
    });

    var actual = documentNode.firstChild;

    expect(actual instanceof DocumentNode).toBeTruthy();
    expect(documentNode.$baz).toBe(actual);

    expect(documentStore.db.order).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo', 'bar', '']
    });
  });
});
