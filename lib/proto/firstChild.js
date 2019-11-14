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

module.exports = {
  enumerable: false,
  configurable: false,
  get: function() {
    var documentStore = this.documentStore;
    var subs = this.path.slice(0);
    subs.push('');
    var documentName = this.documentName;
    var db = documentStore.db;

    var node = {global: documentName, subscripts: subs};
    if (db.dbx) {
      node.initialise = true;
      node = db.order.call({
        documentStore: documentStore,
        _node: node
      });
    }
    else {
      node = db.order(node);
    }
    var childNode = new documentStore.DocumentNode(documentName, node.subscripts);
    if (!this['$' + node.result]) this['$' + node.result] = childNode;
    return childNode;
  }
};
