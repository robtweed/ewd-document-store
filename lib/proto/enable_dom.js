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

  13 February 2020

*/

var parser = require('./dom/parser');
let Node = require('./dom/Node')();
let augmentElement = require('./dom/augmentElement');

module.exports = function() {
  var dom = function(documentNode) {
    this.$data = documentNode;
    this.name = 'DOM';
    this.isDOM = true;
  };

  var proto = dom.prototype;
  Object.defineProperty(proto, 'documentNode', require('./dom/getDocumentNode'));
  Object.defineProperty(proto, 'documentElement', require('./dom/documentElement'));
  Object.defineProperty(proto, 'docType', require('./dom/documentType'));

  Object.defineProperty(proto, 'firstChild', {
    enumerable: true,
    configurable: false,
    get: function() {
      //console.log('getting first child from top level dom');
      var docElementIx = this.$data.$('documentNode').value;
      if (docElementIx !== '') {
        var docElementNode = this.$data.$(['node', docElementIx]);
        var node = new Node(docElementNode);
        augmentElement.call(node);
        node.ownerDocument = this;
        return node;
      }
      else {
        return null;
      }
    }
  });

  proto.createElement = require('./dom/createElement');
  proto.createComment = require('./dom/createComment');
  proto.createDocument = require('./dom/createDocument');
  proto.createDocumentType = require('./dom/createDocumentType');
  proto.createTextNode = require('./dom/createTextNode');
  proto.createProcessingInstruction = require('./dom/createProcessingInstruction');
  proto.createCDATASection = require('./dom/createCDATASection');
  proto.getElementById = require('./dom/getElementById');
  proto.getElementsByTagName = require('./dom/getElementsByTagName');
  proto.getNodeByNo = require('./dom/getNodeByNo');
  proto.output = require('./dom/output');
  proto.outputAsJSON = require('./dom/outputAsJSON');
  proto.parseJSON = require('./dom/parseJSON');
  proto.xpath = require('./dom/xpath');

  proto.parser = {
    parseFile: parser.parseFile.bind(this),
    parseText: parser.parseText.bind(this)
  };

  this.dom = new dom(this);

};
