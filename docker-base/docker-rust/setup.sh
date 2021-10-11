#!/usr/bin/env bash
# author: Celia Xiao

source ../../resources/auth.env

docker build \
    -t "${BASE_IMAGE_NAME}":"${BASE_IMAGE_VERSION}" \
    -f ./Dockerfile .
