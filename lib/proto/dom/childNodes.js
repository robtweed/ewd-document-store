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

// Implemented as a NodeList Proxy Object

module.exports = {
  enumerable: true,
  configurable: false,
  get: function() {

    var arrayMethods = Object.getOwnPropertyNames(Array.prototype);
    var target = [];
    var _this = this;

    var handler = {

      get: function(target, property) {
        var children = [];
        let childNode = _this.firstChild;
        if (childNode === null) {
          return children;
        }
        children.push(childNode);
        var ok = true;
        var nextSibling;
        do {
          nextSibling = childNode.nextSibling;
          if (nextSibling !== null) {
            children.push(nextSibling);
            childNode = nextSibling;
          }
          else {
            ok = false;
          }
        } while (ok);

        // now have children array
        //  so apply array methods and properties

        if (property) {
          if (property === 'constructor' || property === 'prototype') {
            return;
          }
          if (property !== 'length') {
            if (arrayMethods.includes(property)) {
              //console.log('property = ' + property);
              return function(...args) {
                //console.log('args = ' + args);
                var result = children[property].apply(children, args);
                return result;
              };
            }
          }
          return children[property];
        }
        return children;

      }
    };

    return new Proxy(target, handler);

  }

};