let jsdb = require('./jsdb_piscina');

module.exports = ({ a, b }) => {

  console.log(jsdb.db.global_directory());

  let person = jsdb.use('Person');

  person.forEachLeafNode(function(value, node) {
     console.log(node.path + ': ' + value);
  });


  person.forEachChild(function(ix) {
    console.log('ix = ' + ix);
  });

  let temp = jsdb.use('temp');
  temp.$('x').value = 'hello world';

  return a + b;
};
