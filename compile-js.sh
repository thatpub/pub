#!/bin/sh

JS_EVENT=src/lib/fastdom/fastdom.min.js
JS_FASTDOM=src/lib/fastdom/fastdom.min.js
JS_FASTCLICK=src/lib/fastclick/lib/fastclick.js
JS_LODASH=src/js/lodash.custom.min.js

JS_HELPERS=src/js/helpers.js
JS_APP=src/js/app.js
JS_TEMPLATES=src/js/templates.js
JS_HANDLERS=src/js/handlers.js
JS_INIT=src/js/init.js

LIBS="${JS_EVENT} ${JS_FASTDOM} ${JS_FASTCLICK} ${JS_LODASH}"
SRC="${JS_HELPERS} ${JS_APP} ${JS_TEMPLATES} ${JS_HANDLERS} ${JS_INIT}"

INPUT="${LIBS} ${SRC}"
COMPRESS_OPTIONS="--compress unsafe,keep_fargs,drop_console,collapse_vars,if_return,join_vars,cascade,booleans,loops,unused,comparisons,conditionals,drop_debugger,dead_code,properties,sequences"
OTHER_ARGUMENTS="--screw-ie8 --mangle --comments"

if [ "$1" = "dist" ];then
    uglifyjs ${INPUT} ${COMPRESS_OPTIONS} ${OTHER_ARGUMENTS} --source-map src/js/build/script.js.map --output src/js/build/script.js
else
    uglifyjs ${INPUT} --beautify --source-map src/js/build/script.js.map --output src/js/build/script.js
fi
