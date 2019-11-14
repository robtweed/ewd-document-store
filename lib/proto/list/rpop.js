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

  7 October 2019

*/

module.exports = function(obj) {
  let listNode = this.documentNode;
  if (!listNode.exists) {
    return {};
  }
  let lastNode = listNode.$('lastNode').value;
  let nodeDoc = listNode.$('node');
  let lastNodeDoc = nodeDoc.$(lastNode);  

  let content = lastNodeDoc.$('content').getDocument(true);
  let countNode = listNode.$('count');
  if (countNode.value === 1) {
    listNode.delete();
  }
  else {
    let prevNode = lastNodeDoc.$('previousNode').value;
    listNode.$('lastNode').value = prevNode;
    nodeDoc.$([prevNode, 'nextNode']).delete();
    lastNodeDoc.delete();
    countNode.increment(-1);
  }
  return content;
  

};
