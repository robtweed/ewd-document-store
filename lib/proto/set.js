/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-19 M/Gateway Developments Ltd,                        |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  18 October 2019

*/

const NON_EXISTENT = 0;

module.exports = function(value, node) {
  var documentStore = this.documentStore;
  var db = documentStore.db;

  function dbxNode(node) {
    return {
      documentStore: documentStore,
      _node: node,
      key: node.global + ';' + node.subscripts.join()
    }
  }

  var path;
  var exists;
  var oldValue;
  var dbx_node;

  if (node) {
    path = node.subscripts;
    var result;
    if (db.dbx) {
      dbx_node = dbxNode(node);
      result = db.get.call(dbx_node);
    }
    else {
      result = db.get(node);
    }
    oldValue = result.data;
    exists = (result.defined !== NON_EXISTENT);
  }
  else {
    node = this._node;
    path = this.path;
    oldValue = this.value;
    exists = this.exists;
    if (db.dbx) {
      dbx_node = this;
    }
  }

  var enode = {
    documentName: this.documentName,
    path: path
  }
  documentStore.emit('beforeSet', enode);
  enode.before = {
    value: oldValue,
    exists: exists
  };
  if (typeof value === 'boolean') value = value.toString();
  if (db.dbx) {
    db.set.call(dbx_node, value);
  }
  else {
    node.data = value;
    db.set(node, documentStore);
  }
  enode.value = value;
  documentStore.emit('afterSet', enode);
};
