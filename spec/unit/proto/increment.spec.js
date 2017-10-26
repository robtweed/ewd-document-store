'use strict';

var increment = require('../../../lib/proto/increment');
var dbMock = require('../mocks/db');

describe('unit/proto/increment:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;

      this.documentName = 'rob';
      this.path = ['counter'];
      this._node = {
        global: 'rob',
        subscripts: ['counter']
      };

      this.value = 2;
      this.exists = true;

      this.increment = increment;
    };

    DocumentStore = function (db) {
      this.db = db;
      this.emit = jasmine.createSpy();
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode();
  });

  it('should increment integer value', function () {
    var expected = 3;

    documentStore.db.increment.and.returnValue({data: 3});

    var actual = documentNode.increment();

    expect(actual).toBe(expected);

    expect(documentStore.db.increment).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['counter']
    });

    expect(documentStore.emit.calls.count()).toBe(2);
    expect(documentStore.emit.calls.argsFor(0)).toEqual([
      'beforeSet',
      jasmine.objectContaining({
        documentName: 'rob',
        path: ['counter']
      })
    ]);
    expect(documentStore.emit.calls.argsFor(1)).toEqual([
      'afterSet',
      {
        documentName: 'rob',
        path: ['counter'],
        before: {
          value: 2,
          exists: true
        },
        value: 3
      }
    ]);
  });
});
