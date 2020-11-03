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

var doc = documentStore.use('xpath', ['dom']);

doc.delete();
doc.enable_dom();

console.log(1111111);

doc.dom.parser.parseFile('xpath.xml', function(dom) {
  if (dom.error) {
    console.log(dom);
  }
  else {
    console.log(dom.output(2));
  }
});


