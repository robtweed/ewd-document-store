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

var Attr = require('./Attr')();

module.exports = {
  enumerable: true,
  configurable: false,

  get: function() {
    var ownerDocument = this.ownerDocument;
    var this_nodeNo = this.nodeNo;
    var domData = ownerDocument.$data;
    var nodeDoc = domData.$('node');
    var _this = this;
    var target = [];

    var handler = {

      get(target, property) {

        if (property === 'length') {
          return _this.$data.$('attr').countChildren();
        }

        if (property === 'item') {
          return function(no) {
            if (typeof no === 'undefined') return null;
            var attr;
            var attributes = [];
            var attrObj = _this.getAttributes();
            for (var name in attrObj) {
              attr = new Attr(name, attrObj[name], _this);
              attributes.push(attr);
            }
            return attributes[no];
          }
        }

        if (property === 'getNamedItem') {
          return function(name) {
            if (typeof name === 'undefined') return null;
            var attrObj = _this.getAttributes();
            if (typeof attrObj[name] === 'undefined') return null;
            return new Attr(name, attrObj[name], _this);
          }
        }

        return null;
      }

    };

    return new Proxy(target, handler);

  }
};
