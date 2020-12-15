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

  15 November 2019

*/

let Node = require('./Node')();
let augmentElement = require('./augmentElement');
let augmentTextNode = require('./augmentTextNode');
let augmentDocType = require('./augmentDocType');

module.exports = function(type) {
  //console.log('getNode type = ' + type + '; ' + this.nodeNo);
  var this_data = this.$data;
  let pointerDoc = this_data.$(type);
  if (pointerDoc.exists) {
    let ix = pointerDoc.value;
    if (ix === '') {
      pointerDoc.delete();
      return null;
    }
    var nodeDoc;
    if (this.isDOM) {
      nodeDoc = this.$data.$('node');
    }
    else {
      nodeDoc = this.ownerDocument.$data.$('node');
    }
    var ixNode = nodeDoc.$(ix);
    var node = new Node(ixNode);
    node.ownerDocument = this.ownerDocument;

    if (node.nodeType === 1) {
      augmentElement.call(node);
    }
    if (node.nodeType === 3 || node.nodeType === 4 || node.nodeType === 8) {
      augmentTextNode.call(node);
    }
    if (node.nodeType === 7) {
      Object.defineProperty(node, 'target', require('./nodeName'));
      Object.defineProperty(node, 'data', require('./nodeValue'));
    }
    if (node.nodeType === 10) {
      augmentDocType.call(node);
    }
    return node;
  }
  else {
    return null;
  }
};

