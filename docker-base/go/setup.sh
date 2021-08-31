#!/usr/bin/env bash
# author: Jacob Xie

source ../../resources/go.env
docker build \
    -t "${BASE_IMAGE_NAME}":"${BASE_IMAGE_VERSION}" \
    --build-arg GO_IMAGE_NAME="${GO_IMAGE_NAME}" \
    --build-arg GO_IMAGE_VERSION="${GO_IMAGE_VERSION}" \
    -f ./Dockerfile .
