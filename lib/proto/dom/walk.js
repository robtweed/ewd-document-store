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

  16 December 2020

*/

module.exports = function(params, fn) {

  params = params || {};
  params.stop = false;

  function walk(params) {
    var type = this.nodeType;
    if (type === 1) {
      
      if (fn) {
         fn.call(this, params);
      }

      if (params.stop) return;

      if (this.hasChildElements()) {
        var childNode;
        var childElements = this.childElements;
        for (var i = 0; i < childElements.length; i++) {
          childNode = childElements[i];
          walk.call(childNode, params);
          if (params.stop) break;
        }
        if (params.stop) return;
      }
    }
  }
  walk.call(this.documentElement, params);
  delete params.stop;
  return params;
};