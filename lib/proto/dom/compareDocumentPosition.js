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

  16 November 2019

*/

var walkElements = require('./walkElements');

module.exports = function(secondElement) {

  const DISCONNECTED = 1;
  const PRECEEDING = 2;
  const FOLLOWING = 4;
  const CONTAINS = 8;
  const CONTAINED = 16;
  const ATTRIBUTES = 32;

  if (this.ownerDocument.keys !== secondElement.ownerDocument.keys) {
    return DISCONNECTED;
  }

  var mask;

  // attributes

  var type = this.nodeType;

  if (type === 2) {
    var attrObj = this.ownerElement.getAttributes();
    var name1 = this.name;
    var name2 = secondElement.name;
    for (var name in attrObj) {
      if (name === name1) {
        mask = FOLLOWING;
        break;
      }
      if (name === name2) {
        mask = PRECEEDING;
        break;
      }
    } 
    return mask | ATTRIBUTES;
  }

  // elements

  if (type !== 1) return;  

  var params = {
    no1: this.nodeNo,
    no2: secondElement.nodeNo
  }

  walkElements.call(this, params, function(node, params) {
    if (node.nodeNo === params.no1) {
      params.first = 'this';
      params.stop = true;
      return;
    }
    if (node.nodeNo === params.no2) {
      params.first = 'secondElement';
      params.stop = true;
      return;
    }
  });

  mask = FOLLOWING;
  if (params.first === 'secondElement') {
    mask = PRECEEDING;
  }

  // does this contain second Element?

  var this_nodeNo = this.nodeNo;
  var currentNode = secondElement;
  var parentNode;
  var ok = true;
  var found = false;
  do {
    parentNode = currentNode.parentNode;
    if (parentNode === null) {
      ok = false;
    }
    else {
      if (parentNode.nodeNo === this_nodeNo) {
        mask = mask | CONTAINED;
        found = true;
        ok = false;
      }
      else {
        currentNode = parentNode;
      }
    }
  } while (ok);

  if (found) {
    return mask;
  }

  // does second Element contain this one?

  var target_nodeNo = secondElement.nodeNo;
  var currentNode = this;
  var ok = true;
  do {
    parentNode = currentNode.parentNode;
    if (parentNode === null) {
      ok = false;
   }
    else {
      if (parentNode.nodeNo === target_nodeNo) {
        mask = mask | CONTAINS;
        ok = false;
      }
      else {
        currentNode = parentNode;
      }
    }
  } while (ok);

  return mask;

};
