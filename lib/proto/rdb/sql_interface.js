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

  20 November 2019

*/

module.exports = function(query, inputObj, log) {

  var tempDoc = this.use('qewdTemp', [process.pid]);
  tempDoc.delete();

  if (inputObj) {
    tempDoc.$('input').setDocument(inputObj);
  }
  var results = {
    returnValue: this.db.dbx.function('sqlquery^qewdSqlInterface', query)
  };
  var data = [];
  var spoolDoc = this.use('mgsqls', [process.pid, 1, 0]);
  if (spoolDoc.exists) {
    data = spoolDoc.getDocument(true, 1);
  }
  var schema = [];
  var outputDoc = tempDoc.$(['output', 0]);
  if (outputDoc.exists) {
    outputDoc.forEachChild(function(ix, node) {
      var obj = {
        ref: node.value,
        format: node.$(0).value
      };
      schema.push(obj);
    });
  }
  var output = [];

  data.forEach(function(row, rowNo) {
    var rowObj = {};
    output[rowNo] = [];
    row.forEach(function(column, ix) {
      rowObj = {
        value: column,
        ref: schema[ix].ref,
        format: schema[ix].format
      };
      output[rowNo].push(rowObj);
    });
  });


  results.data = output;
  results.query = tempDoc.$('query').value;
  if (!log) {
    tempDoc.delete();
    spoolDoc.delete();
    this.use('mgtmp', [process.pid]).delete();
  }

  return results;
};
