'use strict';

var deleteMethod = require('../../../lib/proto/delete');
var dbMock = require('../mocks/db');

describe('unit/proto/delete:', function () {
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
      this._node = {
        global: 'rob',
        subscripts: ['address']
      };

      this.value = 'Westminster, London';
      this.exists = true;

      this.delete = deleteMethod;
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

  it('should delete node', function () {
    documentNode.delete();

    expect(documentStore.db.kill).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['address']
    });

    expect(documentStore.emit.calls.count()).toBe(2);
    expect(documentStore.emit.calls.argsFor(0)).toEqual([
      'beforeDelete',
      jasmine.objectContaining({
        documentName: 'rob',
        path: ['address']
      })
    ]);
    expect(documentStore.emit.calls.argsFor(1)).toEqual([
      'afterDelete',
      {
        documentName: 'rob',
        path: ['address'],
        before: {
          value: 'Westminster, London',
          exists: true
        }
      }
    ]);
  });
});
