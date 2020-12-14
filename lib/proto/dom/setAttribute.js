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

let createAttribute = require('./createAttribute');
let getNodeByNo = require('./getNodeByNo');

module.exports = function(name, value) {
  if (!name || name === '') {
    return {error: 'Missing or empty attribute name'};
  }
  if (!value || value === '') {
    return {error: 'Missing or empty attribute value'};
  }
  if (name === 'id') {
    if (this.ownerDocument.getElementById(value) !== null) {
      return {error: 'Id already exists in Document'}
    }
  }
  var attrNode;
  if (!this.$data.$(['attr', name]).exists) {
    attrNode = createAttribute.call(this.ownerDocument, name, value);
    if (attrNode.error) {
      return attrNode;
    }
    attrNode.parentNode = this;
    attrNode.ownerElement = attrNode.parentNode;
    this.$data.$(['attr', name]).value = attrNode.nodeNo;
    if (name === 'id') {
      this.ownerDocument.$data.$(['index', 'by_id', value]).value = this.nodeNo;
    }
  }
  else {
    var ix = this.$data.$(['attr', name]).value;
    var oldValue = this.ownerDocument.$data.$(['node',ix, 'nodeValue']).value;
    this.ownerDocument.$data.$(['node',ix, 'nodeValue']).value = value;
    if (name === 'id') {
      this.ownerDocument.$data.$(['index', 'by_id', oldValue]).delete();
      this.ownerDocument.$data.$(['index', 'by_id', value]).value = this.nodeNo;
    }
    attrNode = getNodeByNo.call(this.ownerDocument, ix);
  }

  return attrNode;
};
