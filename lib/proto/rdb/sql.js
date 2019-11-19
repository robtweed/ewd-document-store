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

  19 November 2019

  Depends on module @types/node-sql-parser

*/

var sql_interface = require('./sql_interface');

const { Parser } = require('node-sql-parser');
const parser = new Parser();

module.exports = function(query) {
  let rdbNode = this.documentNode;
  var global = rdbNode.documentName;
  var keys = rdbNode.path;
  //console.log(rdbNode);

  var ast;
  try {
    ast = parser.astify(query);
  }
  catch(err) {
    return {
      error: 'Unable to parse query',
      err: err
    }
  }

  //console.log(JSON.stringify(ast, null, 2));

  if (ast.type === 'create' && ast.keyword === 'table') {
    var query_string = '';
    var comma = '';
    keys.push('table'); // add table node for storage of data rows
    var tableName = ast.table[0].table;
    query_string = 'create table ' + tableName + ' (';

    var primary_key = {};
    var pk_name;
    ast.create_definitions.forEach(function(colDef) {
      if (colDef.constraint && colDef.definition) {
        colDef.definition.forEach(function(pk) {
          primary_key[pk] = '';
          pk_name = colDef.constraint;
        });
      }
    });

    ast.create_definitions.forEach(function(colDef) {
      if (colDef.column) {
        var col_string = '';
        var name = colDef.column.column;
        var dataType = colDef.definition.dataType;
        col_string = name + ' ' + dataType
        if (dataType === 'VARCHAR' && colDef.definition.length) {
          col_string = col_string + '(' + colDef.definition.length + ')';
        }
        if (colDef.nullable) {
          col_string = col_string + ' ' + colDef.nullable.value;
        }
        if (typeof primary_key[name] === 'undefined') {
          col_string = col_string + ' separate \'' + name + '\'';
        }
        query_string = query_string + comma + col_string;
        comma = ',';
      }
    });

    if (pk_name) {
      query_string = query_string + comma + 'constraint ' + pk_name + ' primary key (';
      comma = '';
      keys.forEach(function(key) {
        query_string = query_string + comma + "'" + key + "'";
        comma = ',';
      });
      for (var name in primary_key) {
        query_string = query_string + comma + name;
        comma = ',';
      }
      query_string = query_string + '))';
    }

    query_string = query_string + ' /*global=' + global + ', delimiter=#*/'

  }

  console.log(query_string);

  console.log(rdbNode);

  var result = sql_interface.call(rdbNode.documentStore, query_string)

  console.log('result = ' + result);

  return true;
};
