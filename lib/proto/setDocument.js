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

  9 October 2018

*/

module.exports = function(document, offset) {
  var that = this;
  var documentName = this.documentName;
  if (!offset) offset = 0;

  var set = function(value, node) {
    if (typeof value === 'string') value = encodeURI(value);
    that._set.call(that, value, node);
  };

  var setFast = function(obj, documentNode) {
    var subs;
    var i;
    var j;
    var node;
    var value;

    for (i in obj){
      if (obj[i] === null || typeof obj[i] === 'undefined') obj[i] = '';

      if (obj[i] instanceof Array) {
        //console.log('Array! ' + JSON.stringify(obj[i]));
        if (obj[i].length !== 0) {
          for (j = 0; j < obj[i].length; j++) {
            if (typeof obj[i][j] === 'object') {
              subs = documentNode.path.slice(0);
              subs.push(i);
              subs.push(j + offset);
              setFast(obj[i][j], {global: documentName, path: subs});
            }
            else {
              value = obj[i][j];
              if (value === null) value = '';
              subs = documentNode.path.slice(0);
              subs.push(i);
              subs.push(j + offset);
              node = {global: documentName, subscripts: subs};
              set(value, node);
            }
          }
        }
      }

      if (typeof obj[i] !== 'object') {
        value = obj[i];
        if (value === null || typeof value === 'undefined') value = '';
        subs = documentNode.path.slice(0);
        subs.push(i);
        node = {global: documentName, subscripts: subs};
        set(value, node);
      }

      if (obj[i] instanceof Object && !(obj[i] instanceof Array)) {
        subs = documentNode.path.slice(0);
        subs.push(i);
        setFast(obj[i], {global: documentName, path: subs});
      }
    }
  };

  setFast(document, {global: documentName, path: this.path.slice(0)});
};

