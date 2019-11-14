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

  22 October 2019

*/

let createAttribute = require('./createAttribute');

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
  var attrNode = createAttribute.call(this, name, value);
  if (attrNode.error) {
    return attrNode;
  }
  attrNode.parentNode = this;
  attrNode.ownerElement = attrNode.parentNode;
  this.$data.$(['attr', name]).value = attrNode.nodeNo;
  if (name === 'id') {
    this.ownerDocument.$data.$index.$(['by_id', value]).value = this.nodeNo;
  }
  return attrNode;
};
