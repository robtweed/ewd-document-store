/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-18 M/Gateway Developments Ltd,                        |
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

  6 April 2018

*/

const NON_EXISTENT = 0;

module.exports = function(value, node) {
  var documentStore = this.documentStore;
  var db = documentStore.db;
  var path;
  var exists;
  var oldValue;

  if (node) {
    path = node.subscripts;
    var result = db.get(node);
    oldValue = result.data;
    exists = (result.defined !== NON_EXISTENT);
  }
  else {
    node = this._node;
    path = this.path;
    oldValue = this.value;
    exists = this.exists;
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
  node.data = value;
  documentStore.db.set(node);
  enode.value = value;
  documentStore.emit('afterSet', enode);
};
