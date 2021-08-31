#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/go.env
docker build \
    -t "${BACKEND_BASE_NAME}":"${BACKEND_BASE_VERSION}" \
    --build-arg GO_IMAGE_NAME="${GO_IMAGE_NAME}" \
    --build-arg GO_IMAGE_VERSION="${GO_IMAGE_VERSION}" \
    -f ./Dockerfile.backend ../..
