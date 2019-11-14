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

// returns the node number for the list member

module.exports = function(member_no) {
  let listNode = this.documentNode;
  if (!listNode.exists) {
    // can only apply this to an existing list
    return '';
  }

  let count = -1; // zero-based counter
  let nodeDoc = listNode.$('node');
  let foundNo = '';

  function getNextNode(nodeNo) {
    count++;
    let thisNodeDoc = nodeDoc.$(nodeNo);
    if (member_no === count) {
      foundNo = nodeNo;
      return '';
    }    
    if (nodeNo === listNode.$('lastNode').value) {
      return '';
    }
    return thisNodeDoc.$('nextNode').value;
  }

  let nodeNo = listNode.$('firstNode').value;
  while (nodeNo !== '') {
    nodeNo = getNextNode(nodeNo);
  }
  return foundNo;
};
