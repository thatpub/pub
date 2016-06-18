;(function () {
    "use strict";
    var express = require("express"),
        /**
         * TODO: remove this stupid dependency on the elasticsearch JS api and just use the HTTP module.
         */
        es = require("elasticsearch"),
        fs = require("fs"),
        client = new es.Client({
            host: "localhost:9200",
            log: ""
        }),
        app = express(),
        bp = require("body-parser"),
        cp = require("cookie-parser"),
        cors = require("cors"),
        http = require("http"),
        server;

    app.use(cors());
    app.use(bp.json());
    app.use(cp());
    app.enable("trust proxy");

    function querySetup ( term ) {
        var termArray = [];

        if ( term.pubName && term.pubName.length > 0 ) {
            termArray.push({
                "terms": {
                    "pubName.exact^2": term.pubName
                }
            });
            termArray.push({
                "terms": {
                    "productNo.exact^2": term.pubName
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
        }

        if ( term.noPubName && term.noPubName.length > 3 ) {
            termArray.push({
                "term": {
                    "title.english2": term.noPubName
                }
            });
            termArray.push({
                "term": {
                    "category.english2": term.noPubName
                }
            });
        }

        return termArray;
    }

    function qBody ( term, termArray ) {
        if ( term.noPubName && term.noPubName.length > 3 ) {
            termArray.push({
                "term": {
                    "section.title.english2": term.noPubName
                }
            });
            termArray.push({
                "term": {
                    "chapter.title.english2": term.noPubName
                }
            });
            /*termArray.push({
             "term": {
             "section.title.exact^2": term.noPubName
             }
             });
             termArray.push({
             "term": {
             "chapter.title.exact^2": term.noPubName
             }
             });*/
        }
        return {
            index: "dept",
            type: "chapter,section,chapter_content,section_content",
            scroll: "60s",
            body: {
                "size": 20,
                "query": {
                    "filtered": {
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "text.english2": term.term
                                        }
                                        /*"multi_match": {
                                         "query": term.term,
                                         "type": "cross_fields",
                                         "use_dis_max": true,
                                         "fields": [
                                         "text.english2",
                                         "chapter.title.english2",
                                         "section.title.english2"
                                         ]
                                         }*/
                                    }
                                ],
                                "should": termArray
                            }
                        }
                    }
                },
                "highlight": {
                    "fields": {
                        "text.english2": {
                            "type": "fvh",
                            "fragment_size": 70
                        },
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
                            "size": 5
                        }
                    },
                    "related_doc": {
                        "significant_terms": {
                            "field": "pubName.exact",
                            "min_doc_count": 2,
                            "size": 5
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
            scroll: "60s",
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
                                                "pubName.raw^2",
                                                "productNo.raw^2",
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
                            "size": 5
                        }
                    },
                    "related": {
                        "significant_terms": {
                            "field": "title.related",
                            "min_doc_count": 75,
                            "size": 5
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
    }

    app.post("/find/content/more", function ( req, res ) {
        if ( req.body.g || req.cookies && req.cookies.placeContent ) {
            var qObj = {
                scroll: "60s",
                scrollId: req.body.g || req.cookies.placeContent
            };
            client.scroll(qObj, function ( error, response ) {
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

    app.post("/find/meta/more", function ( req, res ) {
        if ( req.body.s || req.cookies && req.cookies.placeMeta ) {
            var qObj = {
                scroll: "60s",
                scrollId: req.body.s || req.cookies.placeMeta
            };
            client.scroll(qObj, function ( error, response ) {
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

    /*app.get("/grab*/
    /*", function (req, res) {
     var query = req.params.q;
     });*/

    app.post("/find/content/search", function ( req, res ) {
        /* new search initiated, kill the old one */
        if ( req.body.t && (req.body.g || req.body.s || req.cookies && ( req.cookies.placeMeta || req.cookies.placeContent ) ) ) {
            var opts = {
                hostname: "reset.that.pub",
                port: 80,
                path: "/",
                method: "POST"
            };
            var newReq = http.request(opts, function () {

                client.search(qBody(req.body.t, querySetup(req.body.t)), function ( error, content ) {
                    if ( error ) {
                        console.error(error);
                        res.status(400).json(error);
                    }
                    else {
                        client.search(pBody(req.body.t, querySetup(req.body.t)), function ( error, meta ) {
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
            newReq.write(req.body.g || req.cookies.placeContent);
            newReq.write(req.body.s || req.cookies.placeMeta);
            newReq.end();
        }
        else {
            client.search(qBody(req.body.t, querySetup(req.body.t)), function ( error, content ) {
                if ( error ) {
                    console.error(error);
                    res.status(400).json(error);
                }
                else {
                    client.search(pBody(req.body.t, querySetup(req.body.t)), function ( error, meta ) {
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

    server = app.listen(process.argv[ 2 ], function () {
        var port = server.address().port;
        console.log("Pub/Form Searcher listening on port %s", port);
    });

})();
