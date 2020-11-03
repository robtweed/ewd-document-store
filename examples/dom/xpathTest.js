var qewd_mg_dbx = require('qewd-mg-dbx');
var DocumentStore = require('ewd-document-store');
var xpath = require('xpath');

var params = {
  database: {
    type: 'YottaDB',
    release: 'r1.30',
    architecture: 'x86'
  }
};

var db = new qewd_mg_dbx(params);
var status = db.open();
if (status.error) return;

var documentStore = new DocumentStore(db);

var doc = documentStore.use('test', ['dom']);

doc.delete();

doc.enable_dom();

var json = {
  a: 123,
  b: {
    c: {
      foo: 'bar'
    },
    d: {
      value: 12345
    },
    e: [
      "a",false,2222
    ],
    foo: {
      bar: true
    },
    g: [
      {
        prop1: 123,
        isit: true,
        prop2: 'abc'
      },
      {
        prop1: 345,
        complex: {
          arr: [1, 2, 3],
          node: {
            ok: true
          }
        },
        prop2: 'def'
      }
    ],
  last: 'one'
  }
};

doc.dom.parseJSON(json);

console.log(doc.dom.output(2));


var enode = doc.dom.getElementsByTagName('b')[0];
var foonode = doc.dom.getElementsByTagName('foo')[0];


console.log('relative position: ' + enode.compareDocumentPosition(foonode));
console.log('relative position: ' + foonode.compareDocumentPosition(enode));


console.log(enode.tagName);

var attrs = enode.attributes;

//console.log(attrs[0]);

//console.log(attrs[0].name);
//console.log(attrs[0].value);

var nodes = xpath.select('//foo', doc.dom);
console.log('===========');
console.log(nodes[0].tagName);
console.log(nodes[0].nodeNo);
console.log(nodes[1].tagName);
console.log(nodes[1].nodeNo);
db.close();


return;






console.log('dom:');
console.log(doc.dom);
console.log('===========');

var fc = doc.dom.firstChild;
console.log(fc);


var nodes = xpath.select('//foo', doc.dom);
console.log('===========');
console.log(nodes[0].tagName);
console.log(nodes[0].nodeNo);
console.log(nodes[1].tagName);
console.log(nodes[1].nodeNo);


db.close();


