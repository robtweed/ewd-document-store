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

  22 October 2019

*/

module.exports = function(newNode, existingNode) {
  if (!newNode) {
    return {error: 'Missing new node'};
  }
  if (!existingNode) {
    return {error: 'Missing existing node'};
  }
  let newNode_type = newNode.nodeType;
  if (newNode_type === '') {
    return {error: 'Invalid new node'};
  }
  if (newNode_type === 9) {
    return {error: 'Invalid inserted node type'};
  }
  let existingNode_type = existingNode.nodeType;
  if (existingNode_type === '') {
    return {error: 'Invalid existing node type'};
  }
  if (existingNode_type === 2) {
    return {error: 'Invalid existing node type'};
  }
  if (newNode.parentNode !== null) {
    return {error: 'The node you are trying to insert is already attached to a parent node'};
  }
  var parentNode = existingNode.parentNode;
  if (parentNode === null) {
    return {error: 'The node you are trying to insert before is not attached to a parent node'};
  }

  newNode.parentNode = parentNode;
  var previousSibling = existingNode.previousSibling;
  existingNode.previousSibling = newNode;
  newNode.nextSibling = existingNode;

  if (previousSibling !== null) {
    // new node will be inserted between current node and its previous sibling

    previousSibling.nextSibling = newNode;
    newNode.previousSibling = previousSibling;
  }
  else {
    // inserted node will become the parent's first node
    parentNode.firstChild = newNode;
  }

  return newNode;
};
