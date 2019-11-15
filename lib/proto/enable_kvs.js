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

  6 October 2019

*/

module.exports = function() {
  var kvs = function(documentNode) {
    this.documentNode = documentNode;
    this.index_transforms = {};
  };

  var proto = kvs.prototype;

  proto.add = require('./kvs/add');
  proto.edit = require('./kvs/edit');
  proto.delete = require('./kvs/delete');
  proto.get_by_key = require('./kvs/get_by_key');
  proto.get_by_index = require('./kvs/get_by_index');
  proto.addIndex = require('./kvs/addIndex');
  proto.deleteIndex = require('./kvs/deleteIndex');
  proto.getIndices = require('./kvs/getIndices');
  proto.initialise = require('./kvs/initialise');
  proto.reindex = require('./kvs/reindex');

  this.kvs = new kvs(this);

};
