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

  14 December 2020

*/

module.exports = function() {

  var Attr = function(name, value, elementNode) {
    var ownerDocument = elementNode.ownerDocument;
    var domData = ownerDocument.$data;
    var nodeDoc = domData.$('node');
    var ix = elementNode.$data.$(['attr', name]).value;
    this.$data = nodeDoc.$(ix);
    this.nodeType = 2;
    this.nodeName = name;
    this.nodeValue = value;
    this.ownerElement = elementNode;
    this.isId = (name === 'id');
    this.localName = name;
    this.name = name;
  };

  var proto = Attr.prototype;
  proto.compareDocumentPosition = require('./compareDocumentPosition');
  Object.defineProperty(proto, 'nodeValue', require('./nodeValue'));
  Object.defineProperty(proto, 'value', require('./nodeValue'));

  return Attr;

};
