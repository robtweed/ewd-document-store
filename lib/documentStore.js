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

  22 January 2018

*/

var events = require("events");

var DocumentNode = function(documentStore, documentName, path) {
  if (!documentName) return;
  path = path || [];
  var pathType = typeof path;
  if (pathType === 'string' || pathType === 'number') path = [path];
  if (!Array.isArray(path)) return;
  this.documentStore = documentStore;
  this.name = documentName;
  this.isDocumentNode = true;
  // this.path returns a clone of the path array
  this.path = path.slice(0);
  if (path.length > 0) {
    this.name = path[path.length - 1];
    this.isDocumentNode = false
  }
  this.documentName = documentName;
  // internal globalStore.db node reference
  this._node = {global: documentName, subscripts: this.path};

};

// Now define all its instance methods

var proto = DocumentNode.prototype;
proto._keys = Object.keys(proto).slice(0);

Object.defineProperty(proto, '_defined', require('./proto/defined'));
Object.defineProperty(proto, 'exists', require('./proto/exists'));
Object.defineProperty(proto, 'hasValue', require('./proto/hasValue'));
Object.defineProperty(proto, 'hasChildren', require('./proto/hasChildren'));
Object.defineProperty(proto, 'value', require('./proto/value'));
Object.defineProperty(proto, 'parent', require('./proto/parent'));
Object.defineProperty(proto, 'firstChild', require('./proto/firstChild'));
Object.defineProperty(proto, 'lastChild', require('./proto/lastChild'));
Object.defineProperty(proto, 'nextSibling', require('./proto/nextSibling'));
Object.defineProperty(proto, 'previousSibling', require('./proto/previousSibling'));

proto.delete = require('./proto/delete');
proto.$ = require('./proto/dollar');
proto.increment = require('./proto/increment');
proto.countChildren = require('./proto/count');
proto.forEachChild = require('./proto/forEach');
proto.getDocument = require('./proto/getDocument');
proto.setDocument = require('./proto/setDocument');
proto.forEachLeafNode = require('./proto/forEachLeafNode');
proto.lock = require('./proto/lock');
proto.unlock = require('./proto/unlock');

proto._set = require('./proto/set');



// =============  Top-level Constructor =============

var build = require('./build');

var DocumentStore = function(db) {
  this.db = db;
  this.build = build;
  events.EventEmitter.call(this);
  this.DocumentNode = DocumentNode.bind(undefined, this);
};

proto = DocumentStore.prototype;
proto.__proto__ = events.EventEmitter.prototype;
proto.list = require('./proto/list');

module.exports = DocumentStore;
