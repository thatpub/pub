#!/bin/sh

# From github repo README.md - https://github.com/sass/node-sass

# Thank you for this CWD script, @glenn-jackman
# http://stackoverflow.com/a/1820039/2780033
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

[ -d "${CWD}/util" ] || mkdir "${CWD}/util"
DIR=${CWD}/util/node-sass

# Don't need to repeat everytime if not necessary.
if [ -d "${DIR}" ];then
    exit;
fi

git clone --recursive https://github.com/sass/node-sass.git ${DIR}
cd ${DIR}
git submodule update --init --recursive
npm install
node scripts/build -f
cd ${PWD}
