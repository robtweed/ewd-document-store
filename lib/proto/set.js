/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-20 M/Gateway Developments Ltd,                        |
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

  28 January 2020

*/

const NON_EXISTENT = 0;

module.exports = function(value, node) {
  var documentStore = this.documentStore;

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
    if (documentStore.db.dbx) {
      dbx_node = dbxNode(node);
      result = documentStore.db.get.call(dbx_node);
    }
    else {
      result = documentStore.db.get(node);
    }
    oldValue = result.data;
    exists = (result.defined !== NON_EXISTENT);
  }
  else {
    node = this._node;
    path = this.path;
    oldValue = this.value;
    exists = this.exists;
    if (documentStore.db.dbx) {
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
  if (documentStore.db.dbx) {
    documentStore.db.set.call(dbx_node, value);
  }
  else {
    node.data = value;
    documentStore.db.set(node, documentStore);
  }
  enode.value = value;
  documentStore.emit('afterSet', enode);
};
