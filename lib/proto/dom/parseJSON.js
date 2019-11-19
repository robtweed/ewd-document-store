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

  15 November 2019

Input:

var obj = {
  a: 123,
  b: {
    c: {
      foo: 'bar'
    },
    d: {
      value: 12345
    },
    e: [
      "a",false,2222
    ],
    foo: {
      bar: true
    },
    g: [
      {
        prop1: 123,
        prop2: 'abc'
      },
      {
        prop1: 345,
        prop2: 'def'
      }
    ]
  }
};


Represented as DOM:

<json>
  <a type="number">123</a>
  <b>
    <c>
      <foo type="string">bar</foo>
    </c>
    <d>
      <value type="number">12345</value>
    </d>
    <e type="array">
      <val type="string">a</val>
      <val type="boolean">false</val>
      <val type="number">2222</val>
    </e>
    <foo>
      <bar type="boolean">true</bar>
    </foo>
    <g type="array">
      <val>
        <prop1 type="number">123</prop1>
        <prop2 type="string">abc</prop2>
      </val>
      <val>
        <prop1 type="number">345</prop1>
        <prop2 type="string">def</prop2>
      </val>
    </g>
  </b>
</json>


*/

module.exports = function(json) {

  var documentNode = this.createDocument();
  if (documentNode.error) {
    return documentNode;
  }
  var documentElement = documentNode.appendElement({tagName: 'json'});

  var parse = function(obj) {

    var tagName;
    var j;
    var value;
    var arrayElement;
    var element;

    for (tagName in obj){

      element = this.appendElement({tagName: tagName});

      if (obj[tagName] === null || typeof obj[tagName] === 'undefined') obj[tagName] = '';

      // Array

      if (obj[tagName] instanceof Array) {
        if (obj[tagName].length !== 0) {

          element.setAttribute('type', 'array');

          for (j = 0; j < obj[tagName].length; j++) {

            arrayElement = element.appendElement({tagName: 'val'});

            // Array element is an object

            if (typeof obj[tagName][j] === 'object') {
              parse.call(arrayElement, obj[tagName][j]);
            } 
            else {

              // simple array value

              value = obj[tagName][j];
              if (value === null) value = '';
              arrayElement.setAttribute('type', typeof value);
              arrayElement.textContent = value.toString();
            }
          }
        }
      }

      // Leaf node

      if (typeof obj[tagName] !== 'object') {
        value = obj[tagName];
        if (value === null || typeof value === 'undefined') value = '';
        element.setAttribute('type', typeof value);
        element.textContent = value.toString();
      }   

      // Object

      if (obj[tagName] instanceof Object && !(obj[tagName] instanceof Array)) {
        parse.call(element, obj[tagName]);
      }
    }
  };

  parse.call(documentElement, json);  
};
