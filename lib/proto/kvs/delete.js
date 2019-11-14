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

  4 October 2019

*/

module.exports = function(key) {
  if (!key || !this.documentNode.$(['content', key]).exists) {
    return false;
  }
  var _this = this;
  this.initialise();
  this.documentNode.$('indices').forEachChild(function(index_name) {
    var value = _this.documentNode.$(['content', key, index_name]).value;
    if (value !== '') {
      if (_this.index_transforms[index_name]) {
        value = _this.index_transforms[index_name](value);
      }
      _this.documentNode.$(['index_by', index_name, value, key]).delete();
    }
  });

  this.documentNode.$(['content', key]).delete();
  return true;
};
