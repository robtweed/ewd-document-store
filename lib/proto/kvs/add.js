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

  25 November 2019

*/

module.exports = function(key, obj) {
  if (!key || this.documentNode.$(['content', key]).exists) {
    return false;
  }
  this.documentNode.$(['content', key]).setDocument(obj);
  this.initialise();
  var value;
  for (var prop in obj) {
    value = obj[prop];
    if (this.index_transforms[prop]) {
      value = this.index_transforms[prop](value);
    }
    if (this.documentNode.$(['indices', prop]).exists) {
      this.documentNode.$(['index_by',  prop, value, key]).value = '';
    }
  }
  return true;
};
