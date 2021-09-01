#!/usr/bin/env bash
# author: Jacob Bishop
#
# web backend server

# read config
source ../../resources/go.env

# build a prod image. Golang HTTP service serves static HTML files.
docker build \
    -t "${BACKEND_WEB_NAME}":"${BACKEND_WEB_VERSION}" \
    --build-arg BASE_IMAGE_NAME="${BASE_IMAGE_NAME}" \
    --build-arg BASE_IMAGE_VERSION="${BASE_IMAGE_VERSION}" \
    -f ./Dockerfile.backend ../..
