#!/usr/bin/env bash
# author: Jacob Bishop
#
# web backend server

# read config
source ../../resources/go.env

# build a prod image
docker build \
    -t "${BACKEND_BASE_NAME}":"${BACKEND_BASE_VERSION}" \
    --build-arg BASE_IMAGE_NAME="${BASE_IMAGE_NAME}" \
    --build-arg BASE_IMAGE_VERSION="${BASE_IMAGE_VERSION}" \
    -f ./Dockerfile.backend ../..

# copy built JS file from image to local
# TODO:
