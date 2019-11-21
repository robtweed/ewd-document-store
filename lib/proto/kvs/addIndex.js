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

var std_transforms = require('./std_transforms');

module.exports = function(propertyName, transform_module_path) {
  if (propertyName && propertyName !== '') {
    var indexDoc = this.documentNode.$(['indices', propertyName]);
    indexDoc.delete();
    if (this.index_transforms) {
      delete this.index_transforms[propertyName];
    }
    indexDoc.$('index').value = true;

    if (transform_module_path && transform_module_path !== '') {
      indexDoc.$('transform').value = transform_module_path;
      if (std_transforms[transform_module_path]) {
        this.index_transforms[propertyName] = std_transforms[transform_module_path];
      }
      else {
        this.index_transforms[propertyName] = require(transform_module_path);
      }
    }
  }
};

