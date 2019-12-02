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

  2 December 2019

  Depends on module node-sql-parser

*/

var sql_interface = require('./sql_interface');

const { Parser } = require('node-sql-parser');
const parser = new Parser();

module.exports = function(query, log) {
  var rdbNode;
  var global;
  var keys;

  if (this.documentNode) {
    rdbNode = this.documentNode;
    global = rdbNode.documentName;
    keys = rdbNode.path.slice(0);
  }

  var ds = this;
  if (rdbNode) {
    ds = rdbNode.documentStore;
  }

  var query_string = '';
  var comma = '';
  var result;

    // create index by_city on mypatient (city)  ==>
    // create index by_city on mypatient ('x1', city) /*! global=mypatient */

  if (query.startsWith('create index ')) {
    var pieces = query.split('create index ');
    var index = pieces[1].split(' ')[0];
    pieces = query.split(' on ');
    var table = pieces[1].split(' ')[0];
    var fieldList = query.split(' on ' + table)[1].trim();
    fieldList = fieldList.split('(')[1];
    fieldList = fieldList.split(')')[0];
    pieces = fieldList.split(',');
    var fields = [];
    pieces.forEach(function(field) {
      fields.push(field.trim());
    });
    if (table === '' || fields.length === 0) {
      return {
        error: 'Unable to parse query'
      };
    }

    var ix = rdbNode.$('index').lastChild.name;
    if (ix === '') {
      ix = 'x1';
    }
    else {
      var pieces = ix.split('x');
      ix = 'x' + (+pieces[1] + 1);
    }

    var query_string = 'create index ' + ix + ' on ' + table + " ("
    keys.forEach(function(key) {
      query_string = query_string + comma + "'" + key + "'";
      comma = ', ';
    });
    query_string = query_string + ", 'index', '" + index + "'";
    fields.forEach(function(field) {
      query_string = query_string + comma + field;
    });
    query_string = query_string + ') /*! global=' + global + ' */';

    //console.log('sql = ' + query_string);

    result = sql_interface.call(ds, query_string, null, log);
    //console.log(result);
    return result;

  }

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

  var inputObj;

  if (ast.type === 'select') {
    query_string = query;
  }

  if (!rdbNode && (ast.type !== 'select' && ast.type !== 'insert' && ast.type !== 'delete')) {
    return {error: 'Only select, delete and insert allowed'};
  }

  if (ast.type === 'create' && ast.keyword === 'table') {
    var schema = {
      keys: {},
      fields: {}
    };
    comma = '';
    keys.push('table'); // add table node for storage of data rows
    var tableName = ast.table[0].table;
    query_string = 'create table ' + tableName + ' (';
    schema.table_name = tableName;

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
      var fieldObj = {};
      if (colDef.column) {
        var col_string = '';
        var name = colDef.column.column;
        var dataType = colDef.definition.dataType;
        fieldObj = {
          definition: colDef.definition
        };
        col_string = name + ' ' + dataType
        if (dataType === 'VARCHAR' && colDef.definition.length) {
          col_string = col_string + '(' + colDef.definition.length + ')';
        }
        if (colDef.nullable) {
          col_string = col_string + ' ' + colDef.nullable.value;
          fieldObj.nullable = colDef.nullable.value;
        }
        if (typeof primary_key[name] === 'undefined') {
          col_string = col_string + ' separate \'' + name + '\'';
          schema.fields[name] = fieldObj
        }
        else {
          schema.keys[name] = fieldObj;
        }
        query_string = query_string + comma + col_string;
        comma = ', ';
      }
    });

    if (pk_name) {
      query_string = query_string + comma + 'constraint ' + pk_name + ' primary key (';
      comma = '';
      keys.forEach(function(key) {
        query_string = query_string + comma + "'" + key + "'";
        comma = ', ';
      });
      for (var name in primary_key) {
        query_string = query_string + comma + name;
        comma = ', ';
      }
      query_string = query_string + '))';
    }

    query_string = query_string + ' /*! global=' + global + ', delimiter=#*/'

    var schemaDoc = rdbNode.$('schema');
    schemaDoc.delete();
    schemaDoc.setDocument(schema);

  }

  if (ast.type === 'insert' && ast.table) {
    query_string = 'insert into ' + ast.table[0].table + ' (';
    comma = '';
    ast.columns.forEach(function(name) {
      query_string = query_string + comma + name;
      comma = ', ';
    });
    query_string = query_string + ') values (';
    comma = '';
    ast.columns.forEach(function(name) {
      query_string = query_string + comma + ':' + name;
      comma = ', ';
    });
    query_string = query_string + ')';

    inputObj = [];
    ast.values.forEach(function(row) {
      var rowObj = {};
      row.value.forEach(function(item, index) {
        var name = ast.columns[index];
        rowObj[name] = item.value;
      });
      inputObj.push(rowObj);
    });
  }

  if (ast.type === 'delete' && ast.table) {
    query_string = query;
  }

  result = sql_interface.call(ds, query_string, inputObj, log);

  return result
};
