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

  13 November 2020

*/

module.exports = function(max) {

  var documentStore = this.documentStore;
  var dbx = documentStore.db.dbx;

  function dbxNode(node) {
    return {
      documentStore: documentStore,
      _node: node
    }
  }
  if (typeof max === 'undefined') max = false;
  var count = 0;
  var subs = this.path.slice(0);
  subs.push('');
  var node = {global: this.documentName, subscripts: subs};
  if (dbx) {
    node.initialise = true;
  }
  var ok = true;
  do {
    if (dbx) {
      node = documentStore.db.order.call(dbxNode(node));
    }
    else {
      node = documentStore.db.order(node);
    }
    if (node.result !== '') {
      count++;
	}
	else {
	  ok = false;
	}
	if (max && count > max) ok = false;
  }
  while (ok);
  return count;
};
