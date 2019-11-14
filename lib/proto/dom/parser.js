/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
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

var sax = require('sax');
var fs = require('fs');

module.exports = {

  parseFile: function(filepath, callback) {

    var dom = this.dom;
    var documentNode = dom.createDocument();
    if (documentNode.error) {
      return callback(documentNode);
    }
    var stack = [documentNode];
    var saxStream = sax.createStream(true);

    saxStream.on('opentag', function(node) {
      //console.log('open ' + JSON.stringify(node));
      var element = dom.createElement(node.name);
      for (var name in node.attributes) {
        element.setAttribute(name, node.attributes[name]);
      }
      stack[stack.length - 1].appendChild(element);
      stack.push(element);
    });

    saxStream.on('text', function(text) {
      text = text.replace(/(\r\n|\n|\r)/gm, "").trim();
      //console.log('text ' + text);
      var domNode = stack[stack.length - 1];
      if (domNode.nodeType === 1 && text !== '') {
        domNode.textContent = text;
      }
    });

    saxStream.on('comment', function(text) {
      //console.log('comment ' + text);
      var domNode = stack[stack.length - 1];
      var comment = dom.createComment(text);
      domNode.appendChild(comment);
    });

    saxStream.on('cdata', function(text) {
      //console.log('cdata ' + text);
      var domNode = stack[stack.length - 1];
      var cdata = dom.createCDATASection(text);
      domNode.appendChild(cdata);
    });

    saxStream.on('doctype', function(text) {
      //console.log('((( doctype :' + text);
      var pieces = text.split(' ');
      var name = pieces[1];
      var ids = {};
      var id;
      var space;
      for (var ix = 2; ix < pieces.length; ix++) {
        if (pieces[ix] === 'PUBLIC') {
          id = 'publicId';
          ids[id] = '';
          space = '';
        }
        else if (pieces[ix] === 'SYSTEM') {
          id = 'systemId';
          ids[id] = '';
          space = '';
        }
        else {
          ids[id] = ids[id] + space + pieces[ix];
          space = ' ';
        }
      }
      var domNode = stack[stack.length - 1];
      var doctype = dom.createDocumentType(name, ids.publicId, ids.systemId);
    });

    saxStream.on('processinginstruction', function(node) {
      //console.log('*** pi ' + JSON.stringify(node));
      var domNode = stack[stack.length - 1];
      var pi = dom.createProcessingInstruction(node.name, node.body);
      domNode.appendChild(pi);
    });

    saxStream.on('closetag', function(node) {
      stack.pop();
    });

    saxStream.on('end', function() {
      callback(dom);
    });

    fs.createReadStream("xml.txt")
      .pipe(saxStream);

  }

};
