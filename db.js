"use strict";
/**
 * TODO: remove this stupid dependency on the elasticsearch JS api and just use the HTTP module.
 */

const PORT = process.argv[ 2 ];
const express = require("express");
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
