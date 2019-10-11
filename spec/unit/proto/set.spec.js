'use strict';

var set = require('../../../lib/proto/set');
var dbMock = require('../mocks/db');

describe('unit/proto/set:', function () {
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
      this.value = 'Westminster';
      this.exists = true;

      this._set = set;
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

  it('should set with passed node', function () {
    var value = 'The Tower of London';
    var node = {
      global: 'bar',
      subscripts: ['baz']
    };

    documentStore.db.get.and.returnValue({
      data: 'Stratford',
      defined: 1
    });

    documentNode._set(value, node);

    expect(documentStore.db.get).toHaveBeenCalledWith(jasmine.objectContaining({
      global: 'bar',
      subscripts: ['baz']
    }));

    expect(documentStore.db.set).toHaveBeenCalledWith({
      global: 'bar',
      subscripts: ['baz'],
      data: 'The Tower of London'
    });

    expect(documentStore.emit.calls.count()).toBe(2);
    expect(documentStore.emit.calls.argsFor(0)).toEqual([
      'beforeSet',
      jasmine.objectContaining({
        documentName: 'rob',
        path: ['baz']
      })
    ]);
    expect(documentStore.emit.calls.argsFor(1)).toEqual([
      'afterSet',
      {
        documentName: 'rob',
        path: ['baz'],
        before: {
          value: 'Stratford',
          exists: true
        },
        value: 'The Tower of London'
      }
    ]);
  });

  it('should set current node', function () {
    var value = 'The Tower of London';

    documentNode._set(value);

    expect(documentStore.db.set).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['address'],
      data: 'The Tower of London'
    });

    expect(documentStore.emit.calls.count()).toBe(2);
    expect(documentStore.emit.calls.argsFor(0)).toEqual([
      'beforeSet',
      jasmine.objectContaining({
        documentName: 'rob',
        path: ['address']
      })
    ]);
    expect(documentStore.emit.calls.argsFor(1)).toEqual([
      'afterSet',
      {
        documentName: 'rob',
        path: ['address'],
        before: {
          value: 'Westminster',
          exists: true
        },
        value: 'The Tower of London'
      }
    ]);
  });
});
