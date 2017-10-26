'use strict';

var forEach = require('../../../lib/proto/forEach');
var dbMock = require('../mocks/db');
var FIELD_MARK = String.fromCharCode(254);

describe('unit/proto/forEach:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var callback;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore, documentName, subs) {
      this.documentStore = documentStore;

      this._defined = 1;
      this.documentName = documentName;
      this.path = subs || [];
      this._node = {
        global: this.documentName,
        subscripts: this.path
      };

      this.$ = jasmine.createSpy().and.callFake(function (subscript) {
        return new documentStore.DocumentNode(documentName, [subscript]);
      });

      this.forEachChild = forEach;
    };

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode('rob');
    callback = jasmine.createSpy();

    documentStore.db.order.and.returnValues(
      {
        global: 'rob',
        subscripts: ['foo'],
        result: 'fooValue'
      },
      {
        global: 'rob',
        subscripts: ['bar'],
        result: 'barValue'
      }, {
        result: ''
      }
    );

    documentStore.db.previous.and.returnValues(
      {
        global: 'rob',
        subscripts: ['bar'],
        result: 'barValue'
      },
      {
        global: 'rob',
        subscripts: ['foo'],
        result: 'fooValue'
      }, {
        result: ''
      }
    );
  });

  it('should return noting', function () {
    documentNode._defined = 0;

    var actual = documentNode.forEachChild(callback);

    expect(actual).toBeUndefined();
  });

  it('should process without callback', function () {
    documentNode.forEachChild();

    expect(documentStore.db.order.calls.count()).toBe(3);
    expect(documentStore.db.order.calls.argsFor(0)[0]).toEqual({
      global: 'rob',
      subscripts: ['']
    });
    expect(documentStore.db.order.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['foo']
    }));
    expect(documentStore.db.order.calls.argsFor(2)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['bar']
    }));
  });

  it('should call callback exact times with correct arguments and context', function () {
    documentNode.forEachChild(callback);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.calls.all()[0]).toEqual(
      jasmine.objectContaining({
        object: documentNode,
        args: ['fooValue', jasmine.any(DocumentNode)]
      })
    );
    expect(callback.calls.all()[1]).toEqual(
      jasmine.objectContaining({
        object: documentNode,
        args: ['barValue', jasmine.any(DocumentNode)]
      })
    );
  });

  it('should quit from loop', function () {
    callback.and.returnValue(true);

    documentNode.forEachChild(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('fooValue', jasmine.any(DocumentNode));
  });

  ['reverse', {direction: 'reverse'}].forEach(function (params) {
    it('should process reverse direction', function () {
      documentNode.forEachChild(params, callback);

      expect(documentStore.db.previous.calls.count()).toBe(3);
      expect(documentStore.db.previous.calls.argsFor(0)[0]).toEqual({
        global: 'rob',
        subscripts: ['']
      });
      expect(documentStore.db.previous.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
        global: 'rob',
        subscripts: ['bar']
      }));
      expect(documentStore.db.previous.calls.argsFor(2)[0]).toEqual(jasmine.objectContaining({
        global: 'rob',
        subscripts: ['foo']
      }));
    });
  });

  it('should process nodes using prefix', function () {
    var params = {
      prefix: 'f'
    };

    documentNode.forEachChild(params, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('fooValue', jasmine.any(DocumentNode));

    expect(documentStore.db.previous.calls.count()).toBe(1);
    expect(documentStore.db.previous).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['f']
    });
  });

  it('should process nodes forwards using range (from/to)', function () {
    var params = {
      range: {
        from: 'b',
        to: 'd'
      }
    };

    documentStore.db.order.and.returnValues(
      {
        global: 'rob',
        subscripts: ['d' + FIELD_MARK],
        result: ''
      },
      {
        global: 'rob',
        subscripts: ['bar'],
        result: 'bar'
      },
      {
        result: ''
      }
    );

    documentNode.forEachChild(params, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('bar', jasmine.any(DocumentNode));

    expect(documentStore.db.order).toHaveBeenCalledTimes(3);

    expect(documentStore.db.previous.calls.count()).toBe(1);
    expect(documentStore.db.previous).toHaveBeenCalledWith({
      global: 'rob',
      subscripts: ['b']
    });
  });

  it('should process nodes reverse using range (from/to)', function () {
    var params = {
      direction: 'reverse',
      range: {
        from: 'b',
        to: 'd'
      }
    };

    documentStore.db.previous.and.returnValues(
      {
        global: 'rob',
        subscripts: ['b' + FIELD_MARK],
        result: ''
      },
      {
        global: 'rob',
        subscripts: ['bar'],
        result: 'bar'
      },
      {
        result: ''
      }
    );

    documentNode.forEachChild(params, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('bar', jasmine.any(DocumentNode));

    expect(documentStore.db.previous).toHaveBeenCalledTimes(3);
    expect(documentStore.db.previous.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['d']
    }));
    expect(documentStore.db.previous.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['b' + FIELD_MARK]
    }));
    expect(documentStore.db.previous.calls.argsFor(2)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['bar']
    }));
  });

  it('should process nodes forwards using range (to only)', function () {
    var params = {
      range: {
        to: 'bar'
      }
    };

    documentStore.db.order.and.returnValues(
      {
        global: 'rob',
        subscripts: ['bar' + FIELD_MARK],
        result: ''
      },
      {
        global: 'rob',
        subscripts: ['bar'],
        result: 'bar'
      },
      {
        result: ''
      }
    );

    documentNode.forEachChild(params, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('bar', jasmine.any(DocumentNode));

    expect(documentStore.db.order).toHaveBeenCalledTimes(3);
    expect(documentStore.db.order.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['bar' + FIELD_MARK]
    }));
    expect(documentStore.db.order.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['']
    }));
    expect(documentStore.db.order.calls.argsFor(2)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['bar']
    }));
  });

  it('should process nodes forwards using range (to is number)', function () {
    var params = {
      range: {
        to: '2'
      }
    };

    documentStore.db.order.and.returnValues(
      {
        global: 'rob',
        subscripts: ['1'],
        result: '1'
      },
      {
        global: 'rob',
        subscripts: ['2'],
        result: '2'
      }
    );

    documentNode.forEachChild(params, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('1', jasmine.any(DocumentNode));

    expect(documentStore.db.order).toHaveBeenCalledTimes(2);
    expect(documentStore.db.order.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['']
    }));
    expect(documentStore.db.order.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['1'],
      result: '1'
    }));
  });
});
