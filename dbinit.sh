#!/bin/sh
screen -dmS dba node db.js 32551 $1
screen -dmS dbb node db.js 32552 $1
screen -dmS dbc node db.js 32553 $1
screen -dmS dbd node db.js 32554 $1
