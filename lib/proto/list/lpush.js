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

  4 October 2019

*/

module.exports = function(obj) {
  let listNode = this.documentNode;
  let isNew = !listNode.exists;
  let ix = listNode.$('nextNodeNo').increment();
  listNode.$('count').increment();
  let nodeDoc = listNode.$('node');
  let newNodeDoc = nodeDoc.$(ix);
  newNodeDoc.$('content').setDocument(obj);

  if (isNew) {
    listNode.$('firstNode').value = ix;
    listNode.$('lastNode').value = ix;
  }
  else {
    let firstNodeDoc = listNode.$('firstNode');
    let previousFirst = firstNodeDoc.value;
    firstNodeDoc.value = ix;
    newNodeDoc.$('nextNode').value = previousFirst;
    nodeDoc.$([previousFirst, 'previousNode']).value = ix;
  }
  return ix;
};
