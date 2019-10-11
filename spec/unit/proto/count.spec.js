'use strict';

var count = require('../../../lib/proto/count');
var dbMock = require('../mocks/db');

describe('unit/proto/count:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;
      this.documentName = 'rob';
      this.path = ['address'];

      this.countChildren = count;
    };

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

  it('should return node children count', function () {
    var expected = 1;

    documentStore.db.order.and.returnValues(
      {
        global: 'rob',
        subscripts: ['address'],
        result: 'addressValue'
      },
      {
        result: ''
      }
    );

    var actual = documentNode.countChildren();

    expect(actual).toBe(expected);

    expect(documentStore.db.order.calls.count()).toBe(2);
    expect(documentStore.db.order.calls.argsFor(0)).toEqual([
      {
        global: 'rob',
        subscripts: ['address', '']
      }
    ]);
    expect(documentStore.db.order.calls.argsFor(1)).toEqual([
      {
        global: 'rob',
        subscripts: ['address'],
        result: 'addressValue'
      }
    ]);
  });
});
