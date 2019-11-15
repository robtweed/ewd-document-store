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

var Node = require('./Node')();
let augmentElement = require('./augmentElement');

module.exports = {
  enumerable: true,
  configurable: false,
  get: function() {
    var documentElementDoc = this.$data.$('documentElement');
    if (documentElementDoc.exists) {
      var ix = documentElementDoc.value;
      var node = this.$data.$(['node', ix]);
      node = new Node(node);
      node.ownerDocument = this;
      augmentElement.call(node);
      return node;
    }
    else {
      return null;
    }
  },
  set: function(documentElementNode) {
    this.$data.$('documentElement').value = documentElementNode.nodeNo;
  }
};

