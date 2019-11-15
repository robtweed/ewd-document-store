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
  var list = function(documentNode) {
    this.documentNode = documentNode;
  };

  var proto = list.prototype;
  proto.lpush = require('./list/lpush');
  proto.rpush = require('./list/rpush');
  proto.lpop = require('./list/lpop');
  proto.rpop = require('./list/rpop');
  proto.count = require('./list/count');
  proto.lrange = require('./list/lrange');
  proto.ltrim = require('./list/ltrim');
  proto.find_no = require('./list/find_no');
  proto.insert_before = require('./list/insert_before');

  this.list = new list(this);

};
