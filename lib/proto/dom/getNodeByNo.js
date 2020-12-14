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

 13 December 2020

*/

var Node = require('./Node')();

module.exports = function(no) {
  var augmentElement = require('./augmentElement');
  var node = this.$data.$(['node', no]);
  if (node.exists) {
    node = new Node(node);
    node.ownerDocument = this;
    if (node.nodeType === 1) augmentElement.call(node);
    if (node.nodeType === 2) {
      Object.defineProperty(node, 'name', require('./nodeName'));
      Object.defineProperty(node, 'value', require('./nodeValue'));
      //node.name = node.nodeName;
      //node.value = node.nodeValue;
    }
    return node;
  }
  else {
    return null;
  }
};

