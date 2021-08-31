#!/usr/bin/env bash
# author: Jacob Bishop
#
# api_v1 image. prod

source ../../resources/docker.web.env
docker build \
    -t "${API_APP_V1_NAME}":"${API_APP_V1_VERSION}" \
    --build-arg API_BASE_V1_NAME="${API_BASE_V1_NAME}" \
    --build-arg API_BASE_V1_VERSION="${API_BASE_V1_VERSION}" \
    -f ./Dockerfile ../..
