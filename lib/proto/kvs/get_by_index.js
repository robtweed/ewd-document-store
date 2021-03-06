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

  21 November 2019

*/

module.exports = function(name, value, return_data) {
  var results = [];
  if (return_data) {
    results = {};
  }
  if (name !== '' && value !== '') {
    var _this = this;
    var indexDoc = this.documentNode.$(['index_by', name]);
    if (!indexDoc.exists) {
      return false;
    }
    indexDoc.$(value).forEachChild(function(key) {
      if (return_data) {
        results[key] = _this.documentNode.$(['content', key]).getDocument(true);
      }
      else {
        results.push(key);
      }
    });
    return results;
  }
  return false;
};
