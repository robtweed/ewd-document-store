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

  7 October 2019

*/

module.exports = function(before_position, obj) {
  let listNode = this.documentNode;
  if (!listNode.exists) {
    // can only apply this to an existing list
    return false;
  }
  let beforeNode = listNode.list.find_no(before_position);
  let nodeDoc = listNode.$('node');
  let beforeNodeDoc = nodeDoc.$(beforeNode);
  if (!beforeNodeDoc.exists) {
    // the specified node you want to insert before does not exist
    return false;
  }
  let ix = listNode.$('nextNodeNo').increment();
  listNode.$('count').increment();
  let newNodeDoc = nodeDoc.$(ix);
  newNodeDoc.$('content').setDocument(obj);
  newNodeDoc.$('nextNode').value = beforeNode;

  let prevNo = beforeNodeDoc.$('previousNode').value;
  beforeNodeDoc.$('previousNode').value = ix;
  if (prevNo === '') {
    // inserted node will become new first node
    listNode.$('firstNode').value = ix;
  }
  else {
    nodeDoc.$([prevNo, 'nextNode']).value = ix;
  }
  return ix;
};
