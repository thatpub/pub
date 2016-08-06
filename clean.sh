#!/bin/sh

for DIR in "$@"
do
    if [ -d "${DIR}/" ];then
        if [ -d "${DIR}/css" ];then
            rm -rf ${DIR}/css/*
        else
            mkdir ${DIR}/css
        fi
        if [ -d "${DIR}/js" ];then
            rm -rf ${DIR}/js/*
        else
            mkdir ${DIR}/js
        fi
    else
        mkdir -p ${DIR}/css ${DIR}/js
    fi
done
