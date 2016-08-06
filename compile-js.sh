#!/bin/sh

if [ "$1" = "dist" ];then
    JS_EVENT=src/lib/event/build/event.min.js
    JS_FASTDOM=src/lib/fastdom/fastdom.min.js
    JS_FASTCLICK=src/lib/fastclick/lib/fastclick.js
    JS_LODASH=src/js/lodash.custom.min.js
    JS_IMMUTABLE=src/lib/immutable/dist/immutable.min.js
else
    JS_EVENT=src/lib/event/build/event.js
    JS_FASTDOM="src/lib/fastdom/fastdom.js src/lib/fastdom/fastdom-strict.js"
    JS_FASTCLICK=src/lib/fastclick/lib/fastclick.js
    JS_LODASH=src/js/lodash.custom.js
    JS_IMMUTABLE=src/lib/immutable/dist/immutable.js
fi

JS_HELPERS=src/js/helpers.js
JS_TEMPLATES=src/js/templates.js
JS_APP=src/js/app.js

LIBS="${JS_EVENT} ${JS_FASTDOM} ${JS_FASTCLICK} ${JS_LODASH} ${JS_IMMUTABLE}"
SRC="${JS_HELPERS} ${JS_TEMPLATES} ${JS_APP}"

INPUT="${LIBS} ${SRC}"

COMPRESS_OPTIONS="--compress unsafe,keep_fargs,drop_console,if_return,join_vars,cascade,booleans,loops,unused,comparisons,conditionals,drop_debugger,dead_code,properties,sequences"
OTHER_ARGUMENTS="--screw-ie8 --mangle --comments"
OUTPUTS="--source-map dist/js/script.js.map --output dist/js/script.js"

if [ "$1" = "dist" ];then
    uglifyjs ${INPUT} ${COMPRESS_OPTIONS} ${OTHER_ARGUMENTS} ${OUTPUTS}
else
    uglifyjs ${INPUT} ${OUTPUTS}
fi
