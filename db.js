;(function() {
  String.prototype.toTitle = function () {
    return this.replace(/(?:[^a-zA-Z<\/0-9]+?|^)(\w\S*)/gmi, function( full, txt ) {
      return ( full.charAt(0) === ' ' ) ? ' ' + txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  String.prototype.toPubName = function() {
    var removed = '',
        count = 0,
        extraction = [],
        regQueryPubName = /(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g,
        regEOLDashCheck = /[\-\cI\v\0\f]$/m;
    removed = this.replace(regQueryPubName, function( txt ) {
      if ( extraction && (extraction.length > 0) && regEOLDashCheck.test(extraction[count-1]) ) {
        extraction[count-1] += txt.toUpperCase().replace(/\s/g, '');
      }
      else {
        extraction.push( txt.toUpperCase().replace(/\s/g, '') );
      }
      count += 1;
      return '';
    });
    return {
      extract: extraction,
      remove: removed
    };
  };
})();
(function() {
  var express = require("express"),
      es = require("elasticsearch"),
      fs = require("fs"),
      client = new es.Client({
        host: "localhost:9200",
        log: ""
      }),
      _ = require("lodash-node"),
      app = express(),
      bp = require("body-parser"),
      cp = require("cookie-parser"),
      cors = require("cors"),
      http = require("http"),
      server;

  app.use(cors());
  app.use(bp.json());
  app.use(bp.urlencoded({ extended: true }));
  app.use(cp());
  app.enable('trust proxy');
  function querySetup ( term ) {
    var termArray = [];

    if( term.pubName && term.pubName.length > 0 ) {
      termArray.push({
        "terms": {
          "pubName.exact": term.pubName
        }
      });
      termArray.push({
        "terms": {
          "productNo.exact": term.pubName
        }
      });
      termArray.push({
        "terms": {
          "pubName.raw": term.pubName
        }
      });
      termArray.push({
        "terms": {
          "productNo.raw": term.pubName
        }
      });
    };

    if( term.noPubName && term.noPubName.length > 3 ) {
      termArray.push({
        "term": {
          "title.exact": term.noPubName
        }
      });
      termArray.push({
        "term": {
          "category.exact": term.noPubName
        }
      });
    };

    return termArray;
  }

  function qBody( term, termArray ) {
    if( term.noPubName && term.noPubName.length > 3 ) {
      termArray.push({
        "term": {
          "section.title.exact": term.noPubName
        }
      });
      termArray.push({
        "term": {
          "chapter.title.exact": term.noPubName
        }
      });
      termArray.push({
        "multi_match": {
          "query": term.noPubName,
          "type": "most_fields",
          "use_dis_max": true,
          "fields": [
            "category.raw",
            "category.english2"
          ]
        }
      });
    }
    return {
      index: "dept",
      type: "chapter,section,chapter_content,section_content",
      scroll: "3600s",
      body: {
        "size": 20,
        "query": {
          "filtered": {
            "query": {
              "bool": {
                "must": [
                  {
                    "multi_match": {
                      "query": term.term,
                      "type": "cross_fields",
                      "use_dis_max": true,
                      "fields": [
                        "text.english2",
                        "chapter.title.english2",
                        "section.title.english2",
                        "title.english2"
                      ]
                    }
                  }
                ],
                "should": termArray
              }
            }
          }
        },
        "highlight": {
          "fields": {
            "text": {
              "matched_fields": [
                "text.english2"
              ],
              "type": "fvh",
              "number_of_fragments": 0
            },
            "chapter.title": {
              "matched_fields": [
                "chapter.title.english2"
              ],
              "type": "fvh",
              "number_of_fragments": 0
            },
            "section.title": {
              "matched_fields": [
                "section.title.english2"
              ],
              "type": "fvh",
              "number_of_fragments": 0
            },
            "title": {
              "matched_fields": [
                "title.english2"
              ],
              "type": "fvh",
              "number_of_fragments": 0
            },
            "productNo*": {
              "number_of_fragments": 0
            }
          }
        },
        "aggs": {
          "group_doc": {
            "terms": {
              "field": "pubName.exact",
              "order": {
                "_count": "desc"
              }
            }
          },
          "related": {
            "significant_terms": {
              "field": "text.related",
              "min_doc_count": 75,
              "size": 10
            }
          },
          "related_doc": {
            "significant_terms": {
              "field": "pubName.exact",
              "min_doc_count": 2,
              "size": 10
            }
          },
          "related_category": {
            "significant_terms": {
              "field": "category.exact",
              "min_doc_count": 2,
              "size": 5
            }
          }
        }
      }
    };
  }

  function pBody ( term, termArray ) {
    return {
      index: "dept",
      type: "pub,form",
      scroll: "3600s",
      body: {
        "size": 5,
        "query": {
          "filtered": {
            "query": {
              "bool": {
                "must": [
                  {
                    "multi_match": {
                      "query": term.term,
                      "type": "cross_fields",
                      "use_dis_max": true,
                      "fields": [
                        "title.english2",
                        "pubName.raw",
                        "productNo.raw",
                        "category.english2"
                      ]
                    }
                  }
                ],
                "should": termArray
              }
            }
          }
        },
        "highlight": {
          "fields": {
            "title": {
              "matched_fields": [
                "title.english2"
              ],
              "type": "fvh",
              "number_of_fragments": 0
            },
            "productNo*": {
              "number_of_fragments": 0
            },
            "pubName*": {
              "number_of_fragments": 0
            }
          }
        },
        "aggs": {
          "group_doc": {
            "terms": {
              "field": "pubName.exact",
              "order": {
                "_count": "desc"
              }
            }
          },
          "related_doc": {
            "significant_terms": {
              "field": "pubName.exact",
              "min_doc_count": 45,
              "size": 10
            }
          },
          "related": {
            "significant_terms": {
              "field": "title.related",
              "min_doc_count": 75,
              "size": 10
            }
          },
          "related_category": {
            "significant_terms": {
              "field": "category.exact",
              "min_doc_count": 45,
              "size": 5
            }
          }
        }
      }
    };
  };


  app.post('/content/more', function ( req, res ) {
    if ( req.body.g || req.cookies && req.cookies.placeContent ) {
      var qObj = {
        scroll: "3600s",
        scrollId: req.body.g || req.cookies.placeContent
      };
      client.scroll( qObj, function ( error, response ) {
        if ( error ) {
          console.error(error);
          res.status(400).json(error);
        }
        res.json([ response, null ]);
      });
    }
    else {
      res.status(500).send("bummer you lost your place :(");
    }
  });

  app.post('/meta/more', function ( req, res ) {
    if ( req.body.s || req.cookies && req.cookies.placeMeta ) {
      var qObj = {
        scroll: "3600s",
        scrollId: req.body.s || req.cookies.placeMeta
      };
      client.scroll( qObj, function ( error, response ) {
        if ( error ) {
          console.error(error);
          res.status(400).json(error);
        }
        res.json([ null, response ]);
      });
    }
    else {
      res.status(500).send("bummer you lost your place :(");
    }
  });

  app.post('/content/search/:q', function ( req, res ) {
        var term = ( typeof req.params.q === 'string' ) ? req.params.q : null;
        var query = (term) ? {
          term: term,
          pubName: term.toPubName().extract,
          noPubName: term.toPubName().remove
        } : req.body.t || null;
    /* new search initiated, kill the old one */
    if ( term && (req.body.g || req.body.s || req.cookies && ( req.cookies.placeMeta || req.cookies.placeContent ) ) ) {
      var opts = {
        hostname: 'reset.that.pub',
        port: 80,
        path: '/',
        method: 'POST'
      }
      var newReq = http.request(opts, function(resp) {
<<<<<<< HEAD
        /*fs.appendFileSync(__dirname + "/query.txt", JSON.stringify(qBody(req.body.t, querySetup(req.body.t))) + "\n\n", {encoding: 'utf8'});
        fs.appendFileSync(__dirname + "/query.txt", JSON.stringify(pBody(req.body.t, querySetup(req.body.t))) + "\n\n", {encoding: 'utf8'});*/
        client.search( qBody(query, querySetup(query)), function ( error, content ) {
=======

        client.search( qBody(req.body.t, querySetup(req.body.t)), function ( error, content ) {
>>>>>>> dbb0bfc42b8714772eb4e6ba77783ac7cfa4ff03
          if ( error ) {
            console.error(error);
            res.status(400).json(error);
          }
          else {
            client.search( pBody(query, querySetup(query)), function ( error, meta ) {
              if ( error ) {
                console.error(error);
                res.status(400).json(error);
              }
              else {
                res.json([ content, meta ]);
              }
            });
          }
        });

      });
      newReq.write(req.body.g||req.cookies.placeContent);
      newReq.write(req.body.s||req.cookies.placeMeta);
      newReq.end();
    }
    else {
      client.search( qBody(query, querySetup(query)), function ( error, content ) {
        if ( error ) {
          console.error(error);
          res.status(400).json(error);
        }
        else {
          client.search( pBody(query, querySetup(query)), function ( error, meta ) {
            if ( error ) {
              console.error(error);
              res.status(400).json(error);
            }
            else {
              res.json([ content, meta ]);
            }
          });
        }
      });
    }

  });

  server = app.listen(process.argv[2], function () {
    var port = server.address().port;
    console.log('Pub/Form Searcher listening on port %s', port);
  });

})();
