'use strict';

var $ = require('../../../lib/proto/dollar');
var dbMock = require('../mocks/db');

describe('unit/proto/dollar:', function () {
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

      this.$ = $;
    };

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

  it('should return nothing', function () {
    var actual = documentNode.$();

    expect(actual).toBeUndefined();
  });

  it('should return child node', function () {
    documentNode.$baz = new documentStore.DocumentNode('rob', ['foo', 'baz']);

    var actual = documentNode.$('baz');

    expect(actual).toBe(documentNode.$baz);
  });

  it('should return existing child node', function () {
    documentNode.$('bar', true);

    expect(documentNode.$bar instanceof DocumentNode).toBeTruthy();
  });

  it('should add to parent', function () {
    documentNode.$('bar', true);

    expect(documentNode.$bar instanceof DocumentNode).toBeTruthy();
  });

  it('should return nothing when one of subscript values is null', function () {
    var actual = documentNode.$(['bar', null]);

    expect(actual).toBeUndefined();
  });

  it('should return nothing when one of subscript values is undefined', function () {
    var actual = documentNode.$(['baz', undefined]);

    expect(actual).toBeUndefined();
  });

  it('should return child node when one of subscript is valid array', function () {
    var actual = documentNode.$(['bar', 'baz']);

    expect(actual instanceof DocumentNode).toBeTruthy();
    expect(actual.documentName).toBe('rob');
    expect(actual.path).toEqual(['foo', 'bar', 'baz']);
  });

  it('should not add to parent when one of subscript is valid array', function () {
    var actual = documentNode.$(['bar', 'baz'], true);

    expect(actual['$bar,baz']).toBeUndefined();
  });
});
