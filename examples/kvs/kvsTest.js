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

var doc = documentStore.use('kvs', ['test']);
doc.enable_kvs();

doc.kvs.addIndex('town', 'toLowerCase');

var obj = {
  name: 'Rob',
  town: 'Redhill'
};

var status = doc.kvs.add("key_1", obj);
console.log('added: ' + status);

var obj = {
  name: 'Simon',
  town: 'St Albans'
};

var status = doc.kvs.add("key_2", obj);
console.log('added: ' + status);

var obj = doc.kvs.get_by_key('key_2');
console.log('got by key_2: ' + JSON.stringify(obj, null, 2));


var obj = doc.kvs.get_by_index('town', 'redhill');
console.log('got by town: ' + JSON.stringify(obj, null, 2));

var obj = doc.kvs.get_by_index('town', 'redhill', true);
console.log('got by town (with data): ' + JSON.stringify(obj, null, 2));


var obj = {
  name: 'Susanne',
  town: 'Redhill'
};

var status = doc.kvs.add("key_3", obj);
console.log('added: ' + status);

var obj = doc.kvs.get_by_index('town', 'redhill');
console.log('got by town: ' + JSON.stringify(obj, null, 2));

var obj = doc.kvs.get_by_index('town', 'redhill', true);
console.log('got by town (with data): ' + JSON.stringify(obj, null, 2));

console.log('================');

var status = doc.kvs.delete("key_1");
console.log('added: ' + status);

obj = doc.kvs.get_by_index('town', 'redhill');
console.log('got by town: ' + JSON.stringify(obj, null, 2));

obj = doc.kvs.get_by_index('town', 'redhill', true);
console.log('got by town (with data): ' + JSON.stringify(obj, null, 2));

console.log('================');

console.log('indices: ' + JSON.stringify(doc.kvs.getIndices(), null, 2));

doc.kvs.addIndex('name', 'toLowerCase');

console.log('indices: ' + JSON.stringify(doc.kvs.getIndices(), null, 2));

doc.kvs.reindex();

obj = doc.kvs.get_by_index('name', 'simon', true);
console.log('got by name (with data): ' + JSON.stringify(obj, null, 2));

console.log('================');

obj = {
  name: 'Chris',
  town: 'Banstead'
};

var status = doc.kvs.edit("key_3", obj);
console.log('edited: ' + status);

obj = doc.kvs.get_by_index('town', 'banstead', true);
console.log('got by town: ' + JSON.stringify(obj, null, 2));



db.close();

