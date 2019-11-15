/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
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

  15 November 2019

*/

module.exports = function() {

  var _this = this;
  var rootNode = this;
  if (this.isDOM) {
    _this = this.documentElement;
  }

  function renderNode(obj) {
    var type = this.nodeType;
    var value;
    if (type === 1) {
      var tagName = this.tagName;
      var type = this.getAttribute('type');

      if (type && type === 'array') {
        obj[tagName] = [];
        this.childElements.forEach(function(childNode) {
          if (childNode.hasChildElements()) {
            var arrayElementObj = {};
            renderNode.call(childNode, arrayElementObj);
            obj[tagName].push(arrayElementObj.val);
          }
          else {
            value = childNode.textContent;
            type = childNode.getAttribute('type');
            if (type === 'boolean') {
              value = value.toLowerCase() == 'true' ? true : false;
            }
            if (type === 'number') {
              value = Number(value);
            }
            obj[tagName].push(value);
          }
        });
        return;
      }

      if (!this.hasChildElements()) {
        value = this.textContent;
        if (type === 'boolean') {
          value = value.toLowerCase() == 'true' ? true : false;
        }
        if (type === 'number') {
          value = Number(value);
        }
        obj[tagName] = value;
      }
      else {
        obj[tagName] = {};
        this.childElements.forEach(function(childNode) {
          renderNode.call(childNode, obj[tagName]);
        });
      }
    }
  }

  var json = {};
  if (_this.getAttribute('type') === 'array') {
    json = [];
  }

  renderNode.call(_this, json);

  return json.json;
};
