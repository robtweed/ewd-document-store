# ewd-document-store

[![Build Status](https://travis-ci.org/robtweed/ewd-document-store.svg?branch=master)](https://travis-ci.org/robtweed/ewd-document-store) [![Coverage Status](https://coveralls.io/repos/github/robtweed/ewd-document-store/badge.svg?branch=master)](https://coveralls.io/github/robtweed/ewd-document-store?branch=master)

Persistent JavaScript Objects and a fine-grained Document Database, using a Global Storage database

Rob Tweed <rtweed@mgateway.com>  
7 March 2016, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: [@rtweed](https://twitter.com/rtweed)

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


## Installation

    npm install ewd-document-store


## Using ewd-document-store

  - For full details of ewd-document-store see: [http://gradvs1.mgateway.com/download/ewd-document-store.pdf](http://gradvs1.mgateway.com/download/ewd-document-store.pdf)
  - For a complete, working examples, refer to [examples](https://github.com/robtweed/ewd-document-store-examples) that uses `ewd-document-store`


## Integration tests

### Memory

 * `npm run test:integration` (default)
 * `npm run test:integration:memory`

### InterSystem Caché

  * You must have [InterSystem Caché](http://www.intersystems.com/our-products/cache/cache-overview/) installed
  * You must have `cache.node` in npm global registy. Read [Installation](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=BXJS_intro#BXJS_intro_install) to get more details
  * Run `npm link cache.node` before running integration tests
  * You may need to run this as sudo because of permissions
  * Run `npm run test:integration:cache`

### Gtm or YottaDb

  * Run `npm run test:integration:gtm`


## License

 Copyright (c) 2013-17 M/Gateway Developments Ltd,                           
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
