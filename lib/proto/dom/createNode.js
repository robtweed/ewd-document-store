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

  20 October 2019

*/

var Node = require('./Node')();

module.exports = function(params) {
  var nodeName = params.name;
  var nodeType = params.type;
  var nodeValue = params.value;

  if (!nodeName || nodeName === '') {
    return {error: 'Missing or empty Node Name'};
  }
  if (!nodeType || nodeType === '') {
    return {error: 'Missing or empty Node Type'};
  }
  if (nodeType < 1 || nodeType > 10) {
    return {error: 'Invalid Node Type'};
  }

  let domNode = this.$data;
  let indexNode = domNode.$('index');
  if (nodeType === 9 && indexNode.$(['by_nodeType', nodeType]).exists) {
    return {error: 'Document node already exists'};
  }

  let ix = domNode.$('nextNodeNo').increment();
  let nodeDoc = domNode.$('node');
  let newNodeDoc = nodeDoc.$(ix);

  newNodeDoc.$('nodeName').value = nodeName;
  newNodeDoc.$('nodeType').value = nodeType;
  if (nodeValue) {
    newNodeDoc.$('nodeValue').value = nodeValue;
  }
  newNodeDoc.$('nodeNo').value = ix;

  indexNode.$(['by_nodeType', nodeType, ix]).value = '';

  indexNode.$(['by_nodeName', nodeType, nodeName, ix]).value = '';
  if (nodeName.indexOf(':') !== -1) {
    indexNode.$(['by_LocalName', nodeType, nodeName.split(':')[0], ix]).value = '';
  }


  if (nodeType === 9) {
    domNode.$('documentNode').value = ix;
  }

  var node = new Node(newNodeDoc);
  if (nodeType === 1) {
    node.tagName = node.nodeName;
  }
  node.ownerDocument = this;
  return node;

};
