'use strict';
const fs = require("fs");
const http = require("http");
const es = require("elasticsearch");
const client = new es.Client({
    "host": "localhost:9200",
    "log": "debug"
});
const {
    querySetup,
    makeContentQuery,
    makeMetaQuery
} = require('./query-setup');

const doSearch = function ( res, contentQuery, metaQuery ) {
    client.search(contentQuery, function ( error, content ) {
        if ( error ) {
            let errObj = {
                "msg": "Error in content search attempt",
                error
            };
            console.error("Error in content search attempt", error);
            res.status(400).json(errObj);
        }
        else {
            client.search(metaQuery, function ( error, meta ) {
                if ( error ) {
                    let errObj = {
                        "msg": "Error in meta search attempt",
                        error
                    };
                    console.error("Error in meta search attempt", error);
                    res.status(400).json(errObj);
                }
                else {
                    res.json([ content, meta ]);
                }
            });
        }
    });
};

const contentSearch = function ( req, res ) {
    const { body, cookies } = req;
    const { term, contentPage, metaPage } = body;

    /* new search initiated, kill the old one */
    if ( term ) {
        let query = querySetup(term);
        let contentQuery = makeContentQuery(term, query);
        let metaQuery = makeMetaQuery(term, query);

        if ( contentPage || metaPage || ( cookies && ( cookies.placeMeta || cookies.placeContent ) ) ) {
            const resetOpts = {
                "hostname": "reset.that.pub",
                "port": 443,
                "path": "/",
                "method": "POST"
            };
            let newReq = http.request(resetOpts, function () {
                doSearch(res, contentQuery, metaQuery);
            });
            newReq.write(contentPage || cookies.placeContent);
            newReq.write(metaPage || cookies.placeMeta);
            newReq.end();
        }
        else {
            doSearch(res, contentQuery, metaQuery);
        }
    }
};

const metaMore = function ( req, res ) {
    const { body, cookies } = req;
    const { metaPage } = body;
    const page = metaPage || cookies && cookies.placeMeta;
    if ( page ) {
        var qObj = {
            "scroll": "60s",
            "scrollId": page
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
};

const contentMore = function ( req, res ) {
    const { body, cookies } = req;
    const { contentPage } = body;
    const page = contentPage || cookies && cookies.placeContent;
    if ( page ) {
        var qObj = {
            "scroll": "60s",
            "scrollId": page
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
};

module.exports = {
    contentSearch,
    metaMore,
    contentMore
};
