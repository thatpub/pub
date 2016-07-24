'use strict';
const fs = require("fs");
const es = require("elasticsearch");
const client = new es.Client({
    "host": "localhost:9200",
    "log": ""
});
const {
    querySetup,
    qBody,
    pBody
} = require('./query-setup');

const contentSearch = function ( req, res ) {
    /* new search initiated, kill the old one */
    if ( req.body.t && (req.body.g || req.body.s || req.cookies && ( req.cookies.placeMeta || req.cookies.placeContent ) ) ) {
        let opts = {
            "hostname": "reset.that.pub",
            "port": 80,
            "path": "/",
            "method": "POST"
        };
        let newReq = http.request(opts, function () {

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
};

const metaMore = function ( req, res ) {
    if ( req.body.s || req.cookies && req.cookies.placeMeta ) {
        var qObj = {
            "scroll": "60s",
            "scrollId": req.body.s || req.cookies.placeMeta
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
    if ( req.body.g || req.cookies && req.cookies.placeContent ) {
        var qObj = {
            "scroll": "60s",
            "scrollId": req.body.g || req.cookies.placeContent
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
