'use strict';

var unlock = require('../../../lib/proto/unlock');
var dbMock = require('../mocks/db');

describe('unit/proto/unlock:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore) {
      this.documentStore = documentStore;

      this.documentName = 'rob';
      this.path = ['foo'];
      this._node = {
        global: 'rob',
        subscripts: ['foo']
      };

      this.unlock = unlock;
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

  it('should unlock node', function () {
    documentNode.unlock();

    expect(documentStore.db.unlock).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['foo']
    });
  });
});
