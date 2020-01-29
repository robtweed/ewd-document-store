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

module.exports = function(by) {
  var documentStore = this.documentStore;
  var enode = {
    documentName: this.documentName,
    path: this.path
  }
  documentStore.emit('beforeSet', enode);
  enode.before = {
    value: this.value,
    exists: this.exists
  };
  var value;
  if (documentStore.db.dbx) {
    value = documentStore.db.increment.call(this, by).data;
  }
  else {
    var node = this._node;
    if (typeof by !== 'undefined') {
      node.increment = by;
    }
    value = documentStore.db.increment(node).data;
  }
  value = parseInt(value);
  enode.value = value;
  documentStore.emit('afterSet', enode);
  return value;
};
