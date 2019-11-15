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

  22 October 2019

*/

module.exports = function(childNode) {
  let childNode_type = childNode.nodeType;
  if (childNode_type === 9) {
    return {error: 'Invalid child node type'};
  }
  let parentNode_type = this.nodeType;
  if (parentNode_type === 2) {
    return {error: 'Invalid parent node type'};
  }
  if (childNode.parentNode !== null) {
    return {error: 'Child node is already part of the DOM'};
  }
  if (this.hasChildNodes()) {
    if (parentNode_type === 9 && childNode_type === 1) {
      var noOfElements = 0;
      this.childNodes.forEach(function(childNode) {
        if (childNode.nodeType === 1) {
          noOfElements++;
        }
      });
      if (noOfElements > 0) {
        // can't add more than 1 element to a document node
        return {error: 'Document Node parent already has 1 element child node'};
      }
    } 
    let lastChild = this.lastChild;
    lastChild.nextSibling = childNode;
    childNode.previousSibling = lastChild;
    this.lastChild = childNode;
  }
  else {
    this.firstChild = childNode;
    this.lastChild = childNode;
  }
  if (parentNode_type === 9 && childNode_type === 1) {
    this.ownerDocument.documentElement = childNode;
  }
  childNode.parentNode = this;
  return childNode;
};
