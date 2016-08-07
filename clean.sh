#!/bin/sh

for DIR in "$@"
do
    if [ -d "${DIR}" ];then
        [ -f "${DIR}/index.html" ] && rm -rf $DIR/index.html
        [ -f "${DIR}/index.full.html" ] && rm -rf $DIR/index.full.html
        [ -d "${DIR}/css" ] && rm -rf $DIR/css/* || mkdir $DIR/css
        [ -d "${DIR}/js" ] && rm -rf $DIR/js/* || mkdir $DIR/js
    else
        mkdir -p $DIR/css $DIR/js
    fi
done
