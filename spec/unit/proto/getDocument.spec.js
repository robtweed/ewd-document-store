'use strict';

var getDocument = require('../../../lib/proto/getDocument');
var dbMock = require('../mocks/db');

describe('unit/proto/setDocument:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var callback;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore, documentName, subs) {
      this.documentStore = documentStore;
      this.documentName = documentName;
      this.path = subs || [];
      this._node = {
        global: this.documentName,
        subscripts: this.path
      };
      this.getDocument = getDocument;
    };

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode('rob', ['address']);
    callback = jasmine.createSpy();

    db.version.and.returnValue('Node.js Adaptor for Cache: Version: 1.1.112 (CM); Cache Version: 2016.3 build 168');
    db.data.and.returnValue(
      {
        defined: 1
      }
    );
  });

  it('should return empty object', function () {
    var expected = {};

    db.data.and.returnValue({
      defined: 0
    });

    var actual = documentNode.getDocument();

    expect(actual).toEqual(expected);
    expect(db.data).toHaveBeenCalledWith({
      global: 'rob'
    });
  });

  describe('next global node', function () {
    it('should process defined nodes', function () {
      var expected = {
        bar: 'barValue'
      };

      /*jshint camelcase: false */
      db.next_node.and.returnValues(
        {
          ok: 1
        },
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          data: 'barValue',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );
      /*jshint camelcase: true */

      var actual = documentNode.getDocument();

      expect(actual).toEqual(expected);

      /*jshint camelcase: false */
      expect(db.next_node).toHaveBeenCalledTimes(3);
      expect(db.next_node.calls.argsFor(0)[0]).toEqual({
        global: 'rob',
        subscripts: ['address']
      });
      expect(db.next_node.calls.argsFor(1)[0]).toEqual({
        global: 'rob',
        subscripts: ['address']
      });
      expect(db.next_node.calls.argsFor(2)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );
      /*jshint camelcase: true */

    });

    it('should process node contains bool data', function () {
      var expected = {
        bar: true,
        baz: false
      };

      /*jshint camelcase: false */
      db.next_node.and.returnValues(
        {
          ok: 1
        },
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          data: 'true',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: ['address', 'baz'],
          data: 'false',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );
      /*jshint camelcase: true */

      var actual = documentNode.getDocument();

      expect(actual).toEqual(expected);
    });

    it('should stop processing when no sub nodes', function () {
      var expected = {
        bar: 'barValue'
      };

      /*jshint camelcase: false */
      db.next_node.and.returnValues(
        {
          ok: 1
        },
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          data: 'barValue',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: ['foo', 'baz'],
          data: 'bazValue',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );
      /*jshint camelcase: true */

      var actual = documentNode.getDocument();

      expect(actual).toEqual(expected);
    });
  });

  describe('get sub nodes', function () {
    beforeEach(function () {
      /*jshint camelcase: false */
      db.next_node.and.returnValues(
        {
          ok: 0
        }
      );
      /*jshint camelcase: true */
    });

    it('should process node contains data but has no subnode (1)', function () {
      var expected = {
        bar: 'barValue1'
      };

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          data: 'barValue1',
          result: 'bar',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );

      db.get.and.returnValues(
        {
          data: 'barValue1'
        }
      );

      var actual = documentNode.getDocument();

      expect(actual).toEqual(expected);

      expect(db.order).toHaveBeenCalledTimes(2);
      expect(db.order.calls.argsFor(0)[0]).toEqual({
        global: 'rob',
        subscripts: ['address', '']
      });
      expect(db.order.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );

      expect(db.data).toHaveBeenCalledTimes(2);
      expect(db.data.calls.argsFor(0)[0]).toEqual({
        global: 'rob'
      });
      expect(db.data.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(db.get).toHaveBeenCalledWith(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );
    });

    it('should process node contains bool data', function () {
      var expected = {
        bar: true,
        baz: false
      };

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 1
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          data: 'true',
          result: 'bar',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: ['address', 'baz'],
          data: 'false',
          result: 'baz',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );

      db.get.and.returnValues(
        {
          data: 'true'
        },
        {
          data: 'false'
        }
      );

      var actual = documentNode.getDocument();

      expect(actual).toEqual(expected);
    });

    it('should process node contains array data', function () {
      var expected = {
        '0': 'foo',
        '1': 'bar'
      };

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 1
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', '0'],
          data: 'true',
          result: '0',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: ['address', '1'],
          data: 'false',
          result: '1',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );

      db.get.and.returnValues(
        {
          data: 'foo'
        },
        {
          data: 'bar'
        }
      );

      var actual = documentNode.getDocument();

      expect(actual).toEqual(expected);
    });

    it('should process node contains data and has subnodes (11)', function () {
      var expected = {
        bar: {
          baz: 'bazValue'
        }
      };

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 11
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          data: 'barValue',
          result: 'bar',
          defined: 11
        },
        {
          global: 'rob',
          subscripts: ['address', 'bar', 'baz'],
          data: 'bazValue',
          result: 'baz',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );

      db.get.and.returnValues(
        {
          data: 'barValue'
        },
        {
          data: 'bazValue'
        }
      );

      var actual = documentNode.getDocument();
      expect(actual).toEqual(expected);

      expect(db.order).toHaveBeenCalledTimes(4);
      expect(db.order.calls.argsFor(0)[0]).toEqual({
        global: 'rob',
        subscripts: ['address', '']
      });
      expect(db.order.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', '']
        })
      );
      expect(db.order.calls.argsFor(2)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', 'baz']
        })
      );
      expect(db.order.calls.argsFor(3)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );

      expect(db.data).toHaveBeenCalledTimes(3);
      expect(db.data.calls.argsFor(0)[0]).toEqual({
        global: 'rob'
      });
      expect(db.data.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );
      expect(db.data.calls.argsFor(2)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', 'baz']
        })
      );

      expect(db.get).toHaveBeenCalledTimes(2);
      expect(db.get).toHaveBeenCalledWith(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );
      expect(db.get).toHaveBeenCalledWith(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', 'baz']
        })
      );
    });

    it('should process node does not contain data but has subnodes (10)', function () {
      var expected = {
        bar: {
          foo: 'fooValue'
        }
      };

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 10
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', 'bar'],
          result: 'bar',
          defined: 11
        },
        {
          global: 'rob',
          subscripts: ['address', 'bar', 'foo'],
          data: 'fooValue',
          result: 'foo',
          defined: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0
        }
      );

      db.get.and.returnValues(
        {
          data: 'fooValue'
        }
      );

      var actual = documentNode.getDocument();
      expect(actual).toEqual(expected);

      expect(db.order).toHaveBeenCalledTimes(4);
      expect(db.order.calls.argsFor(0)[0]).toEqual({
        global: 'rob',
        subscripts: ['address', '']
      });
      expect(db.order.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', '']
        })
      );
      expect(db.order.calls.argsFor(2)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', 'foo']
        })
      );
      expect(db.order.calls.argsFor(3)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );

      expect(db.data).toHaveBeenCalledTimes(3);
      expect(db.data.calls.argsFor(0)[0]).toEqual({
        global: 'rob'
      });
      expect(db.data.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar']
        })
      );
      expect(db.data.calls.argsFor(2)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', 'foo']
        })
      );

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(db.get).toHaveBeenCalledWith(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 'bar', 'foo']
        })
      );
    });
  });

  describe('useArrays', function () {
    it('should return array', function () {
      var expected = ['The Tower of London'];

      var useArrays = true;

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', 0],
          result: '0',
          defined: 1,
          id: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0,
          id: 2
        },
        {
          global: 'rob',
          subscripts: ['address', 0],
          result: '0',
          defined: 1,
          id: 3
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0,
          id: 4
        }
      );

      db.get.and.returnValues(
        {
          data: 'The Tower of London'
        }
      );

      var actual = documentNode.getDocument(useArrays);

      expect(actual).toEqual(expected);

      expect(db.order).toHaveBeenCalledTimes(4);
      expect(db.order.calls.argsFor(0)[0]).toEqual({
        global: 'rob',
        subscripts: ['address', '']
      });
      expect(db.order.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 0]
        })
      );
      expect(db.order.calls.argsFor(2)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', '']
        })
      );
      expect(db.order.calls.argsFor(3)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 0]
        })
      );

      expect(db.data).toHaveBeenCalledTimes(2);
      expect(db.data.calls.argsFor(0)[0]).toEqual({
        global: 'rob'
      });
      expect(db.data.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 0]
        })
      );

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(db.data.calls.argsFor(0)[0]).toEqual({
        global: 'rob'
      });
      expect(db.data.calls.argsFor(1)[0]).toEqual(
        jasmine.objectContaining({
          global: 'rob',
          subscripts: ['address', 0]
        })
      );
    });

    it('should return array starts with base offset', function () {
      var expected = ['Westminster'];

      var useArrays = true;
      var offset = 1;

      db.data.and.returnValues(
        {
          defined: 1
        },
        {
          defined: 1
        }
      );

      db.order.and.returnValues(
        {
          global: 'rob',
          subscripts: ['address', 1],
          result: '1',
          defined: 1,
          id: 1
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0,
          id: 2
        },
        {
          global: 'rob',
          subscripts: ['address', 1],
          result: '1',
          defined: 1,
          id: 3
        },
        {
          global: 'rob',
          subscripts: [''],
          result: '',
          defined: 0,
          id: 4
        }
      );

      db.get.and.returnValues(
        {
          data: 'Westminster'
        }
      );

      var actual = documentNode.getDocument(useArrays, offset);

      expect(actual).toEqual(expected);
    });
  });

});
