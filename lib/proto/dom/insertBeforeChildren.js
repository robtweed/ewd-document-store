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

module.exports = function(newNode) {
  if (!newNode) {
    return {error: 'Missing new node'};
  }
  let newNode_type = newNode.nodeType;
  if (newNode_type === '') {
    return {error: 'Invalid new node'};
  }
  if (newNode_type === 9) {
    return {error: 'Invalid inserted node type'};
  }
  if (newNode.parentNode !== null) {
    return {error: 'The node you are trying to insert is already attached to a parent node'};
  }

  var childNodes = this.childNodes;
  this.appendChild(newNode);
  var _this = this;
  childNodes.forEach(function(childNode) {
    _this.removeChild(childNode);
    newNode.appendChild(childNode);
  });

  return newNode;
};
