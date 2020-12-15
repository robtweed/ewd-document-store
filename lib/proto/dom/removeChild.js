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

  15 December 2020

*/

module.exports = function(childNode, deleteFromDOM) {
 
  if (this.nodeNo !== childNode.parentNode.nodeNo) {
    return {error: 'Child Node is not a child of the specified Parent Node'};
  }

  var previousSibling = childNode.previousSibling;
  var nextSibling = childNode.nextSibling;

  // detach child node

  childNode.parentNode = '';
  childNode.previousSibling = '';
  childNode.nextSibling = '';

  // re-link siblings to parent

  if (previousSibling !== null) {
    // removed node had a previous sibling

    if (nextSibling !== null) {
      // removed node had a next sibling
      //  so link the previous and next siblings
      previousSibling.nextSibling = nextSibling;
      nextSibling.previousSibling = previousSibling;
    }
    else {
      // removed child was the last child
      this.lastChild = previousSibling;
      previousSibling.nextSibling = '';
    }
  }
  else {
    // removed child was the first child
    if (nextSibling !== null) {
      nextSibling.previousSibling = '';
      this.firstChild = nextSibling;
    }
    else {
      // removed child was the only child
      this.firstChild = '';
      this.lastChild = '';
    }
  }

  var domIndexDoc = this.ownerDocument.$data.$('index');

  function deleteNode(node) {
    if (childNode.nodeType === 1) {
      var attrs = childNode.getAttributes();
      for (var name in attrs) {
        childNode.removeAttribute(name);
      }
    }
    node.childNodesArray.forEach(function(childNode) {
      deleteNode(childNode);
    });
    var name = node.nodeName;
    var type = node.nodeType;
    var ix = node.nodeNo;
    node.$data.delete();
    domIndexDoc.$(['by_nodeName', type, name, ix]).delete();
    domIndexDoc.$(['by_nodeType', type, ix]).delete();
  }

  if (deleteFromDOM) {
    deleteNode(childNode);
  }

  return childNode;
};
