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

var doc = documentStore.use('xpath', ['dom']);
doc.enable_dom();

var nodes = doc.dom.xpath("//foo[not(@*)]");

nodes.forEach(function(node) {
  console.log(node.nodeNo + '; ' + node.nodeName + '; ' + node.nodeType + '; ' + node.nodeValue + '; ' + node.textContent);
});

nodes = doc.dom.xpath("//foo");

nodes.forEach(function(node) {
  console.log(node.nodeNo + '; ' + node.nodeName + '; ' + node.nodeType + '; ' + node.nodeValue + '; ' + node.textContent);
});


db.close();


