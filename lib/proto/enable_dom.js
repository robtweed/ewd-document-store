/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
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

var parser = require('./dom/parser');

module.exports = function() {
  var dom = function(documentNode) {
    this.$data = documentNode;
    this.name = 'DOM';
    this.isDOM = true
  };

  var proto = dom.prototype;
  Object.defineProperty(proto, 'documentNode', require('./dom/getDocumentNode'));
  Object.defineProperty(proto, 'documentElement', require('./dom/documentElement'));
  Object.defineProperty(proto, 'docType', require('./dom/documentType'));

  proto.createElement = require('./dom/createElement');
  proto.createComment = require('./dom/createComment');
  proto.createDocument = require('./dom/createDocument');
  proto.createDocumentType = require('./dom/createDocumentType');
  proto.createTextNode = require('./dom/createTextNode');
  proto.createProcessingInstruction = require('./dom/createProcessingInstruction');
  proto.createCDATASection = require('./dom/createCDATASection');
  proto.getElementById = require('./dom/getElementById');
  proto.getElementsByTagName = require('./dom/getElementsByTagName');
  proto.output = require('./dom/output');
  /*
  proto.parser = {
    parseFile: function(filepath, callback) {
     parser.parseFile.call(_this, filepath, callback);
    }
  }
  */
  proto.parser = {
    parseFile: parser.parseFile.bind(this)
  }

  this.dom = new dom(this);

};
