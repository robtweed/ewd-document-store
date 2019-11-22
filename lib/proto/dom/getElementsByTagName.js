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

  22 November 2019

*/

// getElementsByTagName must return a live NodeList
//  this is achieved by using a Proxy Object that
//  dynamically builds the array of Nodes each time
//  one of its properties is accessed

var Node = require('./Node')();
let augmentElement = require('./augmentElement');

module.exports = function(name) {

  if (!name || name === '') {
    return {error: 'Missing or empty tagName'};
  }

  var ownerDocument;

  var target = [];
  var _this = this;
  if (_this.isDOM) {
    _this = this.documentNode;
    ownerDocument = this;
  }
  else {
    ownerDocument = this.ownerDocument;
  }

  var arrayMethods = Object.getOwnPropertyNames(Array.prototype);

  var this_nodeNo = _this.nodeNo;
  var domData = ownerDocument.$data;
  var indexDoc = domData.$('index');
  var nodeDoc = domData.$('node');

  var handler = {

    get: function(target, property) {

      //console.log('name = ' + name);
      //console.log('property = ' + property + '; type: ' + typeof property);

      function isChildOfTarget(ix, targetNodeNo) {
        //console.log('isChildOfTarget: ix = ' + ix + '; targetNo: ' + targetNodeNo);
        var finished = false;
        var found = false;
        do {
          ix = nodeDoc.$([ix, 'parent']).value;
          //console.log('parent is ' + ix);
          if (ix === '') {
            finished = true;
          }
          if (ix === targetNodeNo) {
            //console.log('*** found');
            found = true;
            finished = true;
          }
        } while (!finished);
        return found;
      }

      target = [];

      if (name !== '*') {
        //console.log('spinning through index for name ' + name);
        indexDoc.$(['by_nodeName', 1, name]).forEachChild(function(ix) {
          //console.log('ix = ' + ix);
          if (isChildOfTarget(ix, this_nodeNo)) {
            var node = nodeDoc.$(ix);
            node = new Node(node);
            node.ownerDocument = ownerDocument;
            augmentElement.call(node);
            target.push(node);
          }
        });
      }
      else {
        // iterate through all element node names
        indexDoc.$(['by_nodeName', 1]).forEachChild(function(name, nameNode) {
          nameNode.forEachChild(function(ix) {
            if (isChildOfTarget(ix, this_nodeNo)) {
              var node = nodeDoc.$(ix);
              node = new Node(node);
              node.ownerDocument = ownerDocument;
              augmentElement.call(node);
              target.push(node);
            }
          });
        });
      }

      //console.log(arrayMethods);
      if (property) {
        if (property === 'constructor' || property === 'prototype') {
          return;
        }
        if (property !== 'length') {
          if (arrayMethods.includes(property)) {
            //console.log('property = ' + property);
            return function(...args) {
              //console.log('args = ' + args);
              var result = target[property].apply(target, args);
              return result;
            };
          }
        }
        return target[property];
      }
      return target;
    }
  };

  return new Proxy(target, handler);

};
