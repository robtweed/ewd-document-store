# ewd-document-store

[![Build Status](https://travis-ci.org/robtweed/ewd-document-store.svg?branch=master)](https://travis-ci.org/robtweed/ewd-document-store) [![Coverage Status](https://coveralls.io/repos/github/robtweed/ewd-document-store/badge.svg?branch=master)](https://coveralls.io/github/robtweed/ewd-document-store?branch=master)

Persistent JavaScript Objects and a fine-grained Document Database, using a Global Storage database

Rob Tweed <rtweed@mgateway.com>  
7 March 2016, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: [@rtweed](https://twitter.com/rtweed)

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


## About ewd-document-store

The *ewd-document-store* module abstracts Global Storage databases as persistent JSON and/or on-disk JavaScript Objects.  It is built upon the lower-level Global Storage access APIs provided by a number of other modules:

- for YottaDB:
  - [mg-dbx](https://github.com/chrisemunt/mg-dbx)
  - [NodeM](https://github.com/dlwicksell/nodem)
- For InterSystems Cache and IRIS:
  - [mg-dbx](https://github.com/chrisemunt/mg-dbx)
  - the *cache.node* and *iris.node* modules that are provided by InterSystems

*ewd-document-store* is the basis of [QEWD-JSdb](https://github.com/robtweed/qewd-jsdb), and provides APIs for a range of database models, including:

- persistent JSON / on-disk JavaScript Objects
- Redis-like Lists
- Redis-like Key/Object store
- Relational Database with SQL
- Persistent XML/HTML DOM with XPath

For more information, see the [QEWD-JSdb documentation](https://github.com/robtweed/qewd-jsdb).


## Installation

    npm install ewd-document-store


## Using ewd-document-store

Most users of *ewd-document-store* will do so through the [*QEWD* framework](https://github.com/robtweed/qewd)
where it is a tightly-integrated piece of QEWD's core functionality. 

It can also be used independently.  If you do so, you will also need to ensure that you are using one of the lower-level Global Storage access modules described above.

It is recommended that you consult the [QEWD-JSdb documentation](https://github.com/robtweed/qewd-jsdb) for more information.


## Integration tests

  * You must have [InterSystem Caché](http://www.intersystems.com/our-products/cache/cache-overview/) installed
  * You must have `cache.node` in npm global registy. Read [Installation](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=BXJS_intro#BXJS_intro_install) to get more details
  * Run `npm link cache.node` before running integration tests
  * You may need to run this as sudo because of permissions


## License

 Copyright (c) 2013-20 M/Gateway Developments Ltd,                           
 Reigate, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.  
