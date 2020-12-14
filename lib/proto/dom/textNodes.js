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

module.exports = {
  enumerable: true,
  configurable: false,
  get: function() {
    //let getNode = require('./getNode');
    var children = [];
    let childNode = this.firstChild;
    if (childNode === null) {
      return children;
    }
    if (childNode.nodeType === 3) {
      children.push(childNode);
    }
    var ok = true;
    var nextSibling;
    do {
      nextSibling = childNode.nextSibling;
      if (nextSibling !== null) {
        if (nextSibling.nodeType === 3) {
          children.push(nextSibling);
        }
        childNode = nextSibling;
      }
      else {
        ok = false;
      }
    } while (ok);
    return children;
  }
};