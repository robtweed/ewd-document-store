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

module.exports = function(indentation) {

  var isVoid = {
    area: true,
    base: true,
    br: true,
    col: true,
    hr: true,
    img: true,
    input: true,
    link: true,
    meta: true,
    param: true,
    command: true,
    keygen: true,
    source: true
  };

  var _this = this;
  var rootNode = this;
  if (this.isDOM) {
    _this = this.documentNode;
  }
  var isHTML = false;
  var docType = _this.ownerDocument.docType;
  if (docType !== null && docType.name.toLowerCase().startsWith('html')) {
    isHTML = true;
  }

  function renderNode(node, xml, indent) {
    var spaces = '';
    if (typeof indentation !== 'undefined') {
      spaces = ' '.repeat(indent);
    }
    var crlf = '\r\n';
    if (spaces === '') {
      crlf = '';
    }
    var type = node.nodeType;
    if (type === 1) {
      var tagName = node.tagName;
      if (isHTML) tagName = tagName.toLowerCase();
      if (typeof indentation !== 'undefined') {
        xml = xml + crlf + spaces;
      }
      xml = xml + '<' + tagName;

      var attrs = node.getAttributes();
      for (var name in attrs) {
        xml = xml + ' ' + name + '="' + attrs[name] + '"'
      }

      if (!node.hasChildNodes()) {
        if (isHTML) {
          if (isVoid[tagName]) {
            xml = xml + '>';
          }
          else {
            xml = xml + '></' + tagName + '>';
          }
        }
        else {
          xml = xml + ' />';
        }
      }
      else {
        xml = xml + '>';
        var newIndent;
        if (typeof indentation !== 'undefined') {
          newIndent = indent + indentation;
        }
        node.childNodes.forEach(function(childNode) {
          xml = renderNode(childNode, xml, newIndent);
        });
        if (typeof indentation !== 'undefined') {
          xml = xml + '\r\n' + spaces;
        }
        xml = xml + '</' + tagName + '>';
      }
    }
    if (type === 10) {
      if (typeof indentation !== 'undefined') {
        xml = xml + '\r\n' + spaces;
      }
      xml = xml + '<!DOCTYPE ' + node.name;
      var publicId = node.publicId;
      if (publicId && publicId !== '') {
        xml = xml + ' PUBLIC ' + publicId;
      }
      var systemId = node.systemId;
      if (systemId !== '') {
        if (publicId === '') {
          xml = xml + ' SYSTEM';
        }
        xml = xml + ' ' + systemId;
      }
      xml = xml + '>';
      if (typeof indentation !== 'undefined') {
        xml = xml + '\r\n' + spaces;
      }
    }
    if (type === 3) {
      if (typeof indentation !== 'undefined') {
        xml = xml + '\r\n' + spaces;
      }
      xml = xml + node.data;
    }
    if (type === 7) {
      if (typeof indentation !== 'undefined' && indent !== 0) {
        xml = xml + '\r\n' + spaces;
      }
      xml = xml + '<?' + node.target + ' ' + node.data + '?>';
    }
    if (type === 8) {
      if (typeof indentation !== 'undefined') {
        xml = xml + '\r\n' + spaces;
      }
      xml = xml + '<!--' + node.data + '-->';
    }
    if (type === 4) {
      if (typeof indentation !== 'undefined') {
        xml = xml + '\r\n' + spaces;
      }
      xml = xml + '<![CDATA[' + node.data + ']]>';
    }
    return xml;
  }

  var xml = '';
  if (this.isDOM) {
    var crlf = '\r\n';
    this.documentNode.childNodes.forEach(function(childNode) {
      if (childNode.nodeType !== 1) {
        xml = renderNode(childNode, xml, 0);
        //xml = xml + crlf;
        crlf = '\r\n';
      }
    });
    rootNode = this.documentElement;
  }
  if (rootNode) {
    xml = renderNode(rootNode, xml, 0, isHTML);
  }
  return xml;
};
