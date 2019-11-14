/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-18 M/Gateway Developments Ltd,                        |
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

let createNode = require('./createNode');
let augmentDocType = require('./augmentDocType');

module.exports = function(name, publicId, systemId) {

  if (!name || name === '') {
    return {error: 'Missing or empty DocumentType Name'};
  }

  if (name === 'html4_strict') {
    name = 'HTML'
    publicId = publicId || '-//W3C//DTD HTML 4.01//EN';
    systemId = systemId || 'http://www.w3.org/TR/html4/strict.dtd';
  }
  if (name === 'html4_transitional') {
    name = 'HTML'
    publicId = publicId || '-//W3C//DTD HTML 4.01 Transitional//EN';
    systemId = systemId || 'http://www.w3.org/TR/html4/loose.dtd';
  }
  if (name === 'html4_frameset') {
    name = 'HTML'
    publicId = publicId || '//W3C//DTD HTML 4.01 Frameset//EN';
    systemId = systemId || 'http://www.w3.org/TR/html4/frameset.dtd';
  }
  if (name === 'html1_strict') {
    name = 'HTML'
    publicId = publicId || '-//W3C//DTD XHTML 1.0 Strict//EN';
    systemId = systemId || 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd';
  }
  if (name === 'html1_transitional') {
    name = 'HTML'
    publicId = publicId || '//W3C//DTD XHTML 1.0 Transitional//EN';
    systemId = systemId || 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd';
  }


  var node = createNode.call(this, {
    name: name,
    type: 10
  });
  augmentDocType.call(node);

  if (publicId && publicId !== '') {
    if (publicId[0] !== '"') {
      publicId = '"' + publicId + '"';
    }
    node.publicId = publicId;
  }
  if (systemId && systemId !== '') {
    if (systemId[0] !== '"') {
      systemId = '"' + systemId + '"';
    }
    node.systemId = systemId;
  }

  this.$data.$('documentType').value = node.nodeNo;

  this.documentNode.appendChild(node);

  return node;

};
