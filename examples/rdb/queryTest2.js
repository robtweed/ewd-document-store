var qewd_mg_dbx = require('qewd-mg-dbx');
var DocumentStore = require('ewd-document-store');

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


var query = 'select * from mypatient';

var ok = documentStore.sql(query);

console.log('ok = ' + JSON.stringify(ok, null, 2));

db.close();

