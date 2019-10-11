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

  7 September 2017

*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const NON_EXISTENT = 0;
const FIELD_MARK = String.fromCharCode(254);

module.exports = function(callback) {

  if ((this._defined === NON_EXISTENT)) return;

  var result;
  var gnode;
  var subs;
  var node;
  var end = '';
  var seed;
  var quit;

  var db = this.documentStore.db;
  var params = {};
  var direction = 'forwards';
  if (arguments.length > 1) {
    params = arguments[0];
    if (params.direction === 'reverse') {
      direction = 'reverse';
    }
    else if (params === 'reverse') {
      direction = 'reverse';
    }
    callback = arguments[1];
  }
  subs = this.path.slice(0);
  subs.push('');
  node = {global: this.documentName, subscripts: subs};

  if (params.prefix) {
    params.range = {
      from: params.prefix
    }
  }
  if (params.range) {
    var from = params.range.from || '';
    if (direction === 'reverse' && from !== '') from = from + FIELD_MARK;
    var to = params.range.to || '';
    if (to !== '') {
      if (isNumeric(to)) {
        end = to;
      }
      else {
        subs = this.path.slice(0);
        if (direction === 'forwards') to = to + FIELD_MARK;
        subs.push(to);
        node = {global: this.documentName, subscripts: subs};
        if (direction === 'forwards') {
          end = db.order(node).result;
        }
        else {
          end = db.previous(node).result;
        }
      }
    }
    if (from === '') {
      subs = this.path.slice(0);
      subs.push(from);
      node = {global: this.documentName, subscripts: subs};
    }
    else {
      subs = this.path.slice(0);
      subs.push(from);
      node = {global: this.documentName, subscripts: subs};
      if (direction === 'forwards') {
        seed = db.previous(node).result;
        subs = this.path.slice(0);
        subs.push(seed);
        node = {global: this.documentName, subscripts: subs};
      }
    }
  }

  var quit = false;
  var prefix = params.prefix;

  //console.log('*** end = ' + end + '; direction = ' + direction);
  //console.log('start node: ' + JSON.stringify(node));
  do {
    if (direction === 'forwards') {
      node = db.order(node);
    }
    else {
      node = db.previous(node);
    }
    result = node.result;
    //console.log('result = ' + result);
    if (result !== end) {
      if (prefix && result.substr(0, prefix.length) !== prefix) break
      gnode = this.$(result.toString(), false);
      if (callback) quit = callback.call(this, result, gnode);
      if (quit) break;
    }
  }
  while (result.toString() !== end.toString());
};
