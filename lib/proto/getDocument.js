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

  9 April 2018
*/

/*

  No longer needed - GT.M bug fixed

function removeDoubleQuotes(value, db) {
  if (db.version().indexOf('GT.M') !== -1 && value.toString().indexOf('""') !== -1) {
    value = value.split('""').join('"');
  }
  return value;
}
*/

const NON_EXISTENT = 0;
const LEAF_NODE = 1;
const NO_DATA_HAS_CHILDREN = 10;
const HAS_DATA_HAS_CHILDREN = 11;

var convert = require('./convert');

module.exports = function(useArrays, offset) {
  var db = this.documentStore.db;
  if (!offset) offset = 0;
  var documentName = this.documentName;

  var node = {global: documentName};
  var exists = db.data(node);
  //console.log('** check ' + JSON.stringify(node) + ': ' + JSON.stringify(exists));
  if (exists.defined === NON_EXISTENT) return {};

  var arrayOfSubscripts = function(documentNode) {
    var expected = offset;
    var isArray = true;
    var subs = documentNode.subscripts.slice(0);
    subs.push("");
    var node = {global: documentName, subscripts: subs};
    var result;
    do {
      node = db.order(node);
      result = node.result;
      if (result !== '') {
        if (+result !== expected) {
          isArray = false;
          break;
        }
        else {
          expected++;
        }
      }
    }
    while (result !== '');
    return isArray;
  };

  var getSubnodes = function(documentNode) {
    var isArray = false;
    if (useArrays) isArray = arrayOfSubscripts(documentNode);
    var document;
    if (isArray) {
      document = [];
    }
    else {
      document = {};
    }
    var result;
    var subs = documentNode.subscripts.slice(0);
    subs.push('');
    var defined;
    var node = {global: documentName, subscripts: subs};
    var index;
    do {
      node = db.order(node);
      result = node.result;
      if (result !== '') {
        index = result;
        if (isArray) index = index - offset;
        defined = db.data(node).defined;
        //if (defined === LEAF_NODE) {
        if (defined === LEAF_NODE || defined === HAS_DATA_HAS_CHILDREN) {
          document[index] = convert(db.get(node).data);
          //if (document[index] === 'true') document[index] = true;
          //if (document[index] === 'false') document[index] = false;
          //document[index] = removeDoubleQuotes(document[index], db);
        }
        if (defined === NO_DATA_HAS_CHILDREN || defined === HAS_DATA_HAS_CHILDREN) {
          document[index] = getSubnodes(node);
        }
      }
    }
    while (result !== '');
    return document;
  };

  var fastGetDocument = function(node) {
    var noOfSubscripts = node.subscripts.length;

    var addToJSON = function(obj, subscripts, value) {

      var append = function(obj, subscript) {
        // Fix courtesy of David Wicksell, Fourthwatch Software.
        //  To cater for Global nodes with both data and child subscripts, change:
        if (typeof obj[subscript] !== 'object' || typeof obj[subscript] === 'undefined') {
          obj[subscript] = {};
        }

        return obj[subscript];
      };

      function build(obj) {
        i++;
        if (i === subscripts.length) {
          obj = value;
          return obj;
        }
        var obj2 = append(obj, subscripts[i]);
        obj[subscripts[i]] = build(obj2);
        return obj;
      }

      var i = -1;
      obj = build(obj);
      return obj;
    };

    var isSubNode = function(signature, currentArray) {
      var match = true;
      for (var i = 0; i < signature.length; i++) {
        if (signature[i].toString() !== currentArray[i].toString()) {
          match = false;
          break;
        }
      }
      return match;
    };

    var document = {};
    var signature = node.subscripts;
    var match = true;
    var subsCopy;
    var data;
    do {
      delete node.data;
      node = db.next_node(node);
      //data = node.data || '';
      data = convert(node.data);
      //if (typeof data === 'undefined') data = '';
      //if (data === 'false') data = false;
      //if (data === 'true') data = true;
      //data = removeDoubleQuotes(data, db);
      match = false;
      if (node.defined !== NON_EXISTENT) match = isSubNode(signature, node.subscripts);
      if (match) {
        subsCopy = node.subscripts.slice(0);
        subsCopy.splice(0, noOfSubscripts);
        document = addToJSON(document, subsCopy, data);
      }
    } while (match);
    return document;
  };

  if (!useArrays) {
    if (db.next_node(this._node).ok) {
      return fastGetDocument(this._node);
    }
    else {
      return getSubnodes(this._node);
    }
  }
  else {
    return getSubnodes(this._node);
  }
};
