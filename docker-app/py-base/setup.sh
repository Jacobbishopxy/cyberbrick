#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.server.env
docker build \
    -t "${BASE_IMAGE_NAME}":"${BASE_IMAGE_VERSION}" \
    --build-arg FUND_IMAGE_NAME="${FUND_IMAGE_NAME}" \
    --build-arg FUND_IMAGE_VERSION="${FUND_IMAGE_VERSION}" \
    -f ./Dockerfile ../..
