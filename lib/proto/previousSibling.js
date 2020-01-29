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

  29 January 2020

*/

module.exports = {
  enumerable: false,
  configurable: false,
  get: function() {
    var documentStore = this.documentStore;
    var documentName = this.documentName;
    var db = documentStore.db;
    var node;
    if (db.dbx) {
      this._node.initialise = true;
      node = db.previous.call(this);
    }
    else {
      node = db.previous({
        global: documentName,
        subscripts: this.path.slice(0)
      });
    }
    if (node.result === '') return;
    return new documentStore.DocumentNode(documentName, node.subscripts);
  }
};
