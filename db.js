"use strict";
/**
 * TODO: remove this stupid dependency on the elasticsearch JS api and just use the HTTP module.
 */

const cluster = require("cluster");
const numCPUs = require('os').cpus().length;
const startingPort = process.argv[ 2 ] || 32551;
const clusterMap = new Map();

const forceExit = worker => () => {
    worker.exit(1);
};

const reFork = ( worker ) => {
    const newWorker = cluster.fork({ 'PORT': worker.env.PORT });
    const { id } = newWorker;

    clusterMap.set(id, newWorker);
};

if ( cluster.isMaster ) {
    let i = 0;
    for ( ; i < numCPUs; ++i ) {
        const PORT = startingPort + i;
        const worker = cluster.fork({ PORT });
        const { id } = worker;

        worker.on('error', forceExit(worker));

        clusterMap.set(id, worker);
    }

    cluster.on('exit', reFork);
}
else {
    const express = require("express");
    const {
        PORT
    } = process.env;
    const app = express();
    const {
        contentSearch,
        metaMore,
        contentMore
    } = require('./routes');

    app.use(require("cors")());
    app.use(require("body-parser").json());
    app.use(require("cookie-parser")());
    app.enable("trust proxy");

    app.post("/find/content/more", contentMore);
    app.post("/find/meta/more", metaMore);
    app.post("/find/content/search", contentSearch);

    const serverCallback = function () {
        console.log("Pub/Form Searcher listening on port %s", PORT);
    };

    app.listen(PORT, serverCallback);
}
