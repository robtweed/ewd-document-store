'use strict';

var events = require('events');
var rewire = require('rewire');
var DocumentStore = rewire('../../lib/documentStore');

describe('unit/documentStore:', function () {
  var revertBuild;

  beforeEach(function () {
    revertBuild = DocumentStore.__set__('build', {
      no: 'x.x.x',
      date: '1 January 1970'
    });
  });

  afterEach(function () {
    revertBuild();
  });

  describe('DocumentStore', function () {
    var db;
    var documentStore;

    beforeEach(function () {
      db = {};
      documentStore = new DocumentStore(db);
    });

    afterEach(function () {
      documentStore = null;
      db = null;
    });

    it('should be instance of EventEmitter', function () {
      expect(documentStore instanceof events.EventEmitter).toBeTruthy();
    });

    describe('initial props', function () {
      it('should have db prop', function () {
        expect(documentStore.db).toBe(db);
      });

      it('should have build prop', function () {
        expect(documentStore.build).toEqual({
          no: 'x.x.x',
          date: '1 January 1970'
        });
      });

      it('should have DocumentNode prop', function () {
        expect(documentStore.DocumentNode).toEqual(jasmine.any(Function));
      });
    });

    describe('#list', function () {
      it('should be function', function () {
        expect(documentStore.list).toEqual(jasmine.any(Function));
      });
    });
  });

  describe('DocumentNode', function () {
    var db;
    var documentStore;
    var documentNode;

    beforeEach(function () {
      db = {};
      documentStore = new DocumentStore(db);
      documentNode = new documentStore.DocumentNode('rob');
    });

    afterEach(function () {
      documentNode = null;
      documentStore = null;
      db = null;
    });

    describe('proto getters', function () {
      [
        '_defined',
        'exists',
        'hasValue',
        'hasChildren',
        'value',
        'parent',
        'firstChild',
        'lastChild',
        'nextSibling',
        'previousSibling'
      ].forEach(function (prop) {
        describe('#' + prop, function () {
          it('should be defined', function () {
            var expected = jasmine.objectContaining({
              get: jasmine.any(Function)
            });

            var proto = Object.getPrototypeOf(documentNode);

            expect(Object.getOwnPropertyDescriptor(proto, prop)).toEqual(expected);
          });
        });
      });
    });

    describe('proto setters', function () {
      [
        'value'
      ].forEach(function (prop) {
        describe('#' + prop, function () {
          it('should be defined', function () {
            var expected = jasmine.objectContaining({
              set: jasmine.any(Function)
            });

            var proto = Object.getPrototypeOf(documentNode);

            expect(Object.getOwnPropertyDescriptor(proto, prop)).toEqual(expected);
          });
        });
      });
    });

    describe('proto methods', function () {
      [
        'delete',
        '$',
        'increment',
        'countChildren',
        'forEachChild',
        'getDocument',
        'setDocument',
        'forEachLeafNode',
        '_set'
      ].forEach(function (method) {
        describe('#' + method, function () {
          it('should be a function', function () {
            var proto = Object.getPrototypeOf(documentNode);

            expect(proto[method]).toEqual(jasmine.any(Function));
          });
        });
      });
    });

    describe('own props', function () {
      describe('documentStore', function () {
        it('should be defined', function () {
          expect(documentNode.documentStore).toBe(documentStore);
        });
      });

      describe('documentName', function () {
        it('should be defined', function () {
          expect(documentNode.documentName).toBe('rob');
        });
      });

      describe('name', function () {
        it('should be defined', function () {
          expect(documentNode.name).toBe('rob');
        });
      });

      describe('isDocumentNode', function () {
        it('should be truthy', function () {
          expect(documentNode.isDocumentNode).toBeTruthy();
        });
      });

      describe('path', function () {
        it('should be empty', function () {
          expect(documentNode.path).toEqual([]);
        });
      });

      describe('_node', function () {
        it('should be defined', function () {
          expect(documentNode._node).toEqual({
            global: 'rob',
            subscripts: []
          });
        });
      });
    });

    describe('custom paths', function () {
      [
        {
          scenario: 'when array',
          path: ['address', 'city'],
          expected: {
            name: 'city',
            path: ['address', 'city']
          }
        },
        {
          scenario: 'when string',
          path: 'address',
          expected: {
            name: 'address',
            path: ['address']
          }
        },
        {
          scenario: 'when number',
          path: 2,
          expected: {
            name: 2,
            path: [2]
          }
        }
      ].forEach(function (testCase) {
        describe(testCase.scenario, function () {
          beforeEach(function () {
            documentNode = new documentStore.DocumentNode('rob', testCase.path);
          });

          describe('name', function () {
            it('should be correct', function () {
              expect(documentNode.name).toBe(testCase.expected.name);
            });
          });

          describe('isDocumentNode', function () {
            it('should be falsy', function () {
              expect(documentNode.isDocumentNode).toBeFalsy();
            });
          });

          describe('path', function () {
            it('should be correct', function () {
              expect(documentNode.path).toEqual(testCase.expected.path);
            });
          });

          describe('_node', function () {
            it('should be correct', function () {
              expect(documentNode._node).toEqual({
                global: 'rob',
                subscripts: testCase.expected.path
              });
            });
          });
        });
      });
    });
  });
});
