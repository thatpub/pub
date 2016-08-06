'use strict';

const makePubName = function ( pubName ) {
    return [{
        "terms": {
            "pubName.exact^2": pubName
        }
    }, {
        "terms": {
            "productNo.exact^2": pubName
        }
    }, {
        "terms": {
            "pubName.raw": pubName
        }
    }, {
        "terms": {
            "productNo.raw": pubName
        }
    }];
};

const makeNoPubName = function ( noPubName ) {
    return [{
        "term": {
            "title.english2": noPubName
        }
    }, {
        "term": {
            "category.english2": noPubName
        }
    }];
};

const querySetup = function ( term ) {
    const { pubName, noPubName } = term;
    let termArray = [];

    if ( pubName && pubName.length > 0 ) {
        termArray = makePubName(pubName);
    }

    if ( noPubName && noPubName.length > 3 ) {
        return termArray.concat(makeNoPubName(noPubName));
    }

    return termArray;
};

const makeContentQuery = function ( termObj, termArray ) {
    const { noPubName, term } = termObj;
    if ( noPubName && noPubName.length > 3 ) {
        termArray.push({
            "term": {
                "section.title.english2": noPubName
            }
        });
        termArray.push({
            "term": {
                "chapter.title.english2": noPubName
            }
        });
    }
    return {
        "index": "dept",
        "type": "chapter,section,chapter_content,section_content",
        "scroll": "60s",
        "body": {
            "size": 20,
            "query": {
                "filtered": {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "text.english2": term
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
};

const makeMetaQuery = function ( term, termArray ) {
    return {
        "index": "dept",
        "type": "pub,form",
        "scroll": "60s",
        "body": {
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
};

module.exports = {
    querySetup,
    makeContentQuery,
    makeMetaQuery
};
