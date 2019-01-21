'use strict';

require('dotenv').config();

var dbFactory = require('./dbFactory');
var DocumentStore = require('../../');

describe('integration/ewd-document-store:', function () {
  var db;
  var documentStore;

  beforeAll(function () {
    db = dbFactory();
    documentStore = new DocumentStore(db);

    db.open();
  });

  afterAll(function () {
    db.close();
  });

  describe('DocumentNode', function () {
    var documentNode;

    beforeEach(function () {
      documentNode = new documentStore.DocumentNode('temp');
    });

    afterEach(function () {
      documentNode.delete();
    });

    it('_defined', function () {
      var foo = documentNode.$('foo');
      expect(foo._defined).toBe(0);

      foo.$('bar').value = 'barValue';
      expect(foo._defined).toBe(10);

      foo.value = 'fooValue';
      expect(foo._defined).toBe(11);

      foo.$('bar').delete();
      expect(foo._defined).toBe(1);
    });

    it('exists', function () {
      var foo = documentNode.$('foo');

      expect(foo.exists).toBeFalsy();

      foo.value = 'newValue';

      expect(foo.exists).toBeTruthy();
    });

    it('hasValue', function () {
      var foo = documentNode.$('foo');

      expect(foo.hasValue).toBeFalsy();

      foo.value = 'newValue';

      expect(foo.hasValue).toBeTruthy();
    });

    it('hasChildren', function () {
      var foo = documentNode.$('foo');

      expect(foo.hasChildren).toBeFalsy();

      foo.$('bar').value = 'bazValue';

      expect(foo.hasChildren).toBeTruthy();
    });

    it('value', function () {
      var foo = documentNode.$('foo');

      foo.value = 'newValue';
      expect(foo.value).toBe('newValue');

      foo.value = 'true';
      expect(foo.value).toBeTruthy();

      foo.value = 'false';
      expect(foo.value).toBeFalsy();
    });

    it('parent', function () {
      var foo = documentNode.$('foo');
      var bar = foo.$('bar');

      expect(bar.parent).toEqual(foo);
    });

    it('firstChild', function () {
      var foo = documentNode.$('foo');

      foo.$('bar').value = 'barValue';
      foo.$('baz').value = 'bazValue';

      expect(foo.firstChild.value).toBe('barValue');
    });

    it('lastChild', function () {
      var foo = documentNode.$('foo');

      foo.$('bar').value = 'barValue';
      foo.$('baz').value = 'bazValue';

      expect(foo.lastChild.value).toBe('bazValue');
    });

    it('nextSibling', function () {
      var foo = documentNode.$('foo');

      foo.$('bar').value = 'barValue';
      foo.$('baz').value = 'bazValue';

      expect(foo.$('bar').nextSibling.value).toBe('bazValue');
    });

    it('previousSibling', function () {
      var foo = documentNode.$('foo');

      foo.$('bar').value = 'barValue';
      foo.$('baz').value = 'bazValue';

      expect(foo.$('baz').previousSibling.value).toBe('barValue');
    });

    it('#delete', function () {
      var foo = documentNode.$('foo');

      foo.$('bar').value = 'barValue';
      foo.$('baz').value = 'bazValue';

      expect(foo._defined).toBe(10);

      foo.delete();

      expect(foo._defined).toBe(0);
    });

    it('#dollar', function () {
      var foo = documentNode.$();

      expect(foo).toBe(undefined);

      // TODO: add validations
    });

    it('#increment', function () {
      var foo = documentNode.$('foo');

      expect(foo.value).toBe('');

      foo.increment();

      expect(foo.value).toBe(1);
    });

    it('#countChildren', function () {
      documentNode.$('foo').value = 'fooValue';
      documentNode.$('bar').value = 'barValue';
      documentNode.$('baz').value = 'bazValue';

      expect(documentNode.countChildren()).toBe(3);
    });

    describe('#forEachChild', function () {
      beforeEach(function () {
        var foo = {
          a: 'this is a',
          b: 'this is b',
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          c: ['a', 's', 'd'],
          d: {
            a: 'a',
            b: 'b'
          }
        };

        documentNode.$('foo').setDocument(foo);
      });

      it('should return all children', function () {
        var expected = [
          ['Barton', 'temp', 'foo', 'Barton'],
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Douglas', 'temp', 'foo', 'Douglas'],
          ['a', 'temp', 'foo', 'a'],
          ['b', 'temp', 'foo', 'b'],
          ['c', 'temp', 'foo', 'c'],
          ['d', 'temp', 'foo', 'd']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild(function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should stop after first item', function () {
        var expected = [
          ['Barton', 'temp', 'foo', 'Barton']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild(function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));

          return true;
        });

        expect(actual).toEqual(expected);
      });

      it('should return all children in reverse direction', function () {
        var expected = [
          ['d', 'temp', 'foo', 'd'],
          ['c', 'temp', 'foo', 'c'],
          ['b', 'temp', 'foo', 'b'],
          ['a', 'temp', 'foo', 'a'],
          ['Douglas', 'temp', 'foo', 'Douglas'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Barton', 'temp', 'foo', 'Barton']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          direction: 'reverse'
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return all children in reverse direction #2', function () {
        var expected = [
          ['d', 'temp', 'foo', 'd'],
          ['c', 'temp', 'foo', 'c'],
          ['b', 'temp', 'foo', 'b'],
          ['a', 'temp', 'foo', 'a'],
          ['Douglas', 'temp', 'foo', 'Douglas'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Barton', 'temp', 'foo', 'Barton']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild('reverse', function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return children using prefix', function () {
        var expected = [
          ['Barton', 'temp', 'foo', 'Barton'],
          ['Briggs', 'temp', 'foo', 'Briggs']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          prefix: 'B'
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return from-to range', function () {
        var expected = [
          ['Barton', 'temp', 'foo', 'Barton'],
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Douglas', 'temp', 'foo', 'Douglas']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          range: {
            from: 'B',
            to: 'D'
          }
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return from-to range (boundaries, forwards)', function () {
        var expected = [
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Davis', 'temp', 'foo', 'Davis']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          range: {
            from: 'Briggs',
            to: 'Davis'
          }
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return from-* range (forwards)', function () {
        var expected = [
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Douglas', 'temp', 'foo', 'Douglas'],
          ['a', 'temp', 'foo', 'a'],
          ['b', 'temp', 'foo', 'b'],
          ['c', 'temp', 'foo', 'c'],
          ['d', 'temp', 'foo', 'd']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          range: {
            from: 'D'
          }
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return from-* range (reverse)', function () {
        var expected = [
          ['Douglas', 'temp', 'foo', 'Douglas'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Barton', 'temp', 'foo', 'Barton']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          direction: 'reverse',
          range: {
            from: 'D'
          }
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return *-to range', function () {
        var expected = [
          ['Barton', 'temp', 'foo', 'Barton'],
          ['Briggs', 'temp', 'foo', 'Briggs'],
          ['Davies', 'temp', 'foo', 'Davies'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Douglas', 'temp', 'foo', 'Douglas']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          range: {
            to: 'D'
          }
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should return *-to range (reverse)', function () {
        var expected = [
          ['d', 'temp', 'foo', 'd'],
          ['c', 'temp', 'foo', 'c'],
          ['b', 'temp', 'foo', 'b'],
          ['a', 'temp', 'foo', 'a'],
          ['Douglas', 'temp', 'foo', 'Douglas'],
          ['Davis', 'temp', 'foo', 'Davis'],
          ['Davies', 'temp', 'foo', 'Davies']
        ];

        var actual = [];
        documentNode.$('foo').forEachChild({
          direction: 'reverse',
          range: {
            to: 'D'
          }
        }, function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });
    });

    describe('#forEachLeafNode', function () {
      beforeEach(function () {
        var foo = {
          a: 'this is a',
          b: 'this is b',
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          c: ['a', 's', 'd'],
          d: {
            a: 'a',
            b: 'b'
          }
        };

        documentNode.$('foo').setDocument(foo);
      });

      it('should return all leaf nodes', function () {
        var expected = [
          ['J', 'temp', 'foo', 'Barton'],
          ['A', 'temp', 'foo', 'Briggs'],
          ['D', 'temp', 'foo', 'Davies'],
          ['T', 'temp', 'foo', 'Davis'],
          ['N', 'temp', 'foo', 'Douglas'],
          ['this is a', 'temp', 'foo', 'a'],
          ['this is b', 'temp', 'foo', 'b'],
          ['a', 'temp', 'foo', 'c', '0'],
          ['s', 'temp', 'foo', 'c', '1'],
          ['d', 'temp', 'foo', 'c', '2'],
          ['a', 'temp', 'foo', 'd', 'a'],
          ['b', 'temp', 'foo', 'd', 'b']
        ];

        var actual = [];
        documentNode.$('foo').forEachLeafNode(function (nodeName, node) {
          actual.push([nodeName, node.documentName].concat(node.path));
        });

        expect(actual).toEqual(expected);
      });

      it('should stop after first item', function () {
        var expected = [
          ['J', 'temp', 'foo', 'Barton'],
        ];

        var actual = [];
        documentNode.$('foo').forEachLeafNode(function (data, node) {
          actual.push([data, node.documentName].concat(node.path));

          return true;
        });

        expect(actual).toEqual(expected);
      });
    });

    describe('#getDocument', function () {
      beforeEach(function () {
        var foo = {
          a: 'this is a',
          b: 'this is b',
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          c: ['a', 's', 'd'],
          d: {
            a: 'a',
            b: 'b'
          }
        };

        documentNode.$('foo').setDocument(foo);
      });

      it('should return document', function () {
        var expected = {
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          a: 'this is a',
          b: 'this is b',
          c: {
            '0': 'a',
            '1': 's',
            '2': 'd'
          },
          d: {
            a: 'a',
            b: 'b'
          }
        };

        var actual = documentNode.$('foo').getDocument();

        expect(actual).toEqual(expected);
      });

      it('should return document with arrays', function () {
        var expected = {
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          a: 'this is a',
          b: 'this is b',
          c: ['a', 's', 'd'],
          d: {
            a: 'a',
            b: 'b'
          }
        };

        var useArrays = true;
        var actual = documentNode.$('foo').getDocument(useArrays);

        expect(actual).toEqual(expected);
      });

      it('should return document with arrays and offset (array)', function () {
        var expected = {
          c: ['a', 's', 'd']
        };

        var useArrays = true;
        var offset = 1;

        var foo = {
          c: ['a', 's', 'd']
        };

        documentNode.$('foo').delete();
        documentNode.$('foo').setDocument(foo, offset);

        var actual = documentNode.$('foo').getDocument(useArrays, offset);

        expect(actual).toEqual(expected);
      });

      it('should return document with arrays and offset (object with keys)', function () {
        var expected = {
          c: ['a', 's', 'd']
        };

        var useArrays = true;
        var offset = 1;

        var foo = {
          c: {
            '1': 'a',
            '2': 's',
            '3': 'd',
          }
        };

        documentNode.$('foo').delete();
        documentNode.$('foo').setDocument(foo, offset);

        var actual = documentNode.$('foo').getDocument(useArrays, offset);

        expect(actual).toEqual(expected);
      });

      xit('should return document with utf-8 characters', function () {
        var expected = {
          baz: 'Thắng Nguyễn'
        };

        var foo = {
          baz: 'Thắng Nguyễn'
        };

        documentNode.$('foo').delete();
        documentNode.$('foo').setDocument(foo);

        var actual = documentNode.$('foo').getDocument();

        expect(actual).toEqual(expected);
      });
    });

    describe('#setDocument', function () {
      it('should set document', function () {
        var expected = {
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          a: 'this is a',
          b: 'this is b',
          c: {
            '0': 'a',
            '1': 's',
            '2': 'd'
          },
          d: {
            a: 'a',
            b: 'b'
          },
          e: {
            '0': {
              f: 'g'
            }
          }
        };

        var foo = {
          a: 'this is a',
          b: 'this is b',
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          c: ['a', 's', 'd'],
          d: {
            a: 'a',
            b: 'b'
          },
          e: [
            {
              f: 'g'
            }
          ]
        };

        documentNode.$('foo').setDocument(foo);

        var actual = documentNode.$('foo').getDocument();

        expect(actual).toEqual(expected);
      });

      it('should set document using offset', function () {
        var expected = {
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          a: 'this is a',
          b: 'this is b',
          c: {
            '1': 'a',
            '2': 's',
            '3': 'd'
          },
          d: {
            a: 'a',
            b: 'b'
          }
        };

        var foo = {
          a: 'this is a',
          b: 'this is b',
          Barton: 'J',
          Briggs: 'A',
          Davies: 'D',
          Davis: 'T',
          Douglas: 'N',
          c: ['a', 's', 'd'],
          d: {
            a: 'a',
            b: 'b'
          }
        };
        var offset = 1;

        documentNode.$('foo').setDocument(foo, offset);

        var actual = documentNode.$('foo').getDocument();

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('DocumentStore', function () {
    it('#list', function () {
      var expected = ['bar', 'baz', 'foo'];
      var documentNode;

      ['foo', 'bar', 'baz'].forEach(function (name) {
        documentNode = new documentStore.DocumentNode(name);
        documentNode.value = name + 'Value';
      });

      var actual = documentStore.list();
      expect(actual).toEqual(expected);

      ['foo', 'bar', 'baz'].forEach(function (name) {
        documentNode = new documentStore.DocumentNode(name);
        documentNode.delete();
      });
    });
  });
});
