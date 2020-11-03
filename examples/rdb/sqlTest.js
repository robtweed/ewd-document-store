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

var doc = documentStore.use('myrdb', ['rdb']);
doc.enable_rdb();

var query = 'create table mypatient (num int not null, firstname varchar(255), lastname  varchar(255), town varchar(255), constraint pk_mypatient primary key (num))';

var ok = doc.rdb.sql(query);

console.log('ok = ' + JSON.stringify(ok, null, 2));

db.close();

