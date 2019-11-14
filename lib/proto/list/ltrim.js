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

  8 October 2019

*/

module.exports = function(from, to) {
  let listNode = this.documentNode;
  if (!listNode.exists) {
    return false;
  }
  if (typeof from !== 'undefined' && typeof to === 'undefined') {
    to = from;
  }
  if (typeof from === 'undefined') {
    from = 0;
  }
  if (typeof to === 'undefined') {
    to = -1;
  }
  let count = -1; // zero-based counter
  let nodeDoc = listNode.$('node');

  function deleteNode(nodeNo, thisNodeDoc) {
    let prevNo = thisNodeDoc.$('previousNode').value;
    let nextNo = thisNodeDoc.$('nextNode').value;
    thisNodeDoc.delete();
    if (prevNo !== '' && nextNo !== '') {
      // deleted node was in the middle - link previous and next nodes
      nodeDoc.$([prevNo, 'nextNode']).value = nextNo;
      nodeDoc.$([nextNo, 'previousNode']).value = prevNo;
      return;
    }
    if (prevNo === '' && nextNo === '') {
      // deleted node was the only member
      listNode.delete();
      return;
    }
    if (prevNo === '') {
      // deleting first member - make next node the first one
      listNode.$('firstNode').value = nextNo;
      nodeDoc.$([nextNo, 'previousNode']).delete();
      return;
    }
    // must be the last member that was deleted
    // make the previous one the last
    listNode.$('lastNode').value = prevNo;
    nodeDoc.$([prevNo, 'nextNode']).delete();
    return;
  }

  function getNextNode(nodeNo) {
    count++;
  console.log('count = ' + count + '; from = ' + from + '; to = ' + to);
    let thisNodeDoc = nodeDoc.$(nodeNo);
    var nextNode = thisNodeDoc.$('nextNode').value;
    if (count < from) {
      deleteNode(nodeNo, thisNodeDoc);
      if (!listNode.exists) {
        // all nodes have been deleted
        return '';
      }
      return nextNode;
    }
    if (to !== -1 && count > to) {
      deleteNode(nodeNo, thisNodeDoc);
      if (!listNode.exists) {
        // all nodes have been deleted
        return '';
      }
      return nextNode;
    }

    if (nodeNo === listNode.$('lastNode').value) {
      // reached the to node or reached the end of the list
      return '';
    }
    return nextNode;
  }

  let nodeNo = listNode.$('firstNode').value;
  while (nodeNo !== '') {
    nodeNo = getNextNode(nodeNo);
  }
  return true;
};
