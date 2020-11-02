#!/usr/bin/env bash
# author: Jacob Bishop

source ../resources/docker.env
docker build \
    -t "${BASE_IMAGE_NAME}":"${BASE_IMAGE_VERSION}" \
    --build-arg FUND_IMAGE="${FUND_IMAGE}" \
    --build-arg FUND_IMAGE_VERSION="${FUND_IMAGE_VERSION}" \
    -f ../docker-base/Dockerfile ..

