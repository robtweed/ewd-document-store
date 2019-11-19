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

  19 November 2019

*/

let setAttribute = require('./setAttribute');
let getAttribute = require('./getAttribute');
let getAttributes = require('./getAttributes');
let hasAttributes = require('./hasAttributes');
let removeAttribute = require('./removeAttribute');
let removeChild = require('./removeChild');

module.exports = function() {

  Object.defineProperty(this, 'tagName', require('./nodeName'));
  Object.defineProperty(this, 'textContent', require('./textContent'));
  Object.defineProperty(this, 'textNodes', require('./textNodes'));
  Object.defineProperty(this, 'attributes', require('./attributes'));
  this.setAttribute = setAttribute;
  this.getAttribute = getAttribute;
  this.getAttributes = getAttributes;
  this.hasAttributes = hasAttributes;
  this.removeAttribute = removeAttribute;
  this.removeChild = removeChild;
  this.getElementsByTagName = require('./getElementsByTagName');
};
