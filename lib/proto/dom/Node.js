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

module.exports = function() {

  var Node = function(docNode) {
    this.$data = docNode;
  };

  var proto = Node.prototype;
  Object.defineProperty(proto, 'nodeType', require('./nodeType'));
  Object.defineProperty(proto, 'nodeName', require('./nodeName'));
  Object.defineProperty(proto, 'nodeValue', require('./nodeValue'));
  Object.defineProperty(proto, 'nodeNo', require('./nodeNo'));
  Object.defineProperty(proto, 'firstChild', require('./firstChild'));
  Object.defineProperty(proto, 'lastChild', require('./lastChild'));
  Object.defineProperty(proto, 'nextSibling', require('./nextSibling'));
  Object.defineProperty(proto, 'previousSibling', require('./previousSibling'));
  Object.defineProperty(proto, 'parentNode', require('./parentNode'));
  Object.defineProperty(proto, 'childNodes', require('./childNodes'));
  Object.defineProperty(proto, 'childNodesArray', require('./childNodesArray'));
  Object.defineProperty(proto, 'childElements', require('./childElements'));

  proto.hasChildNodes = require('./hasChildNodes');
  proto.hasChildElements = require('./hasChildElements');
  proto.appendChild = require('./appendChild');
  proto.appendElement = require('./appendElement');
  proto.insertBefore = require('./insertBefore');
  proto.insertBeforeChildren = require('./insertBeforeChildren');
  proto.removeAsParent = require('./removeAsParent');
  proto.output = require('./output');
  proto.outputAsJSON = require('./outputAsJSON');
  proto.compareDocumentPosition = require('./compareDocumentPosition');
  proto.setUserData = require('./setUserData');
  proto.getUserDataNode = require('./getUserDataNode');
  proto.getUserDataKeys = require('./getUserDataKeys');
  proto.getUserData = require('./getUserData');
  proto.deleteUserData = require('./deleteUserData');
  proto.hasUserData = require('./hasUserData');

  return Node;

};
