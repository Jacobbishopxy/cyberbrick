#!/usr/bin/env bash
# author: Jacob Bishop
#
# api_v1 base image, including JS deps

source ../../resources/docker.web.env
docker build \
    -t "${API_BASE_V1_NAME}":"${API_BASE_V1_VERSION}" \
    --build-arg FUND_NODE_IMAGE_NAME="${FUND_NODE_IMAGE_NAME}" \
    --build-arg FUND_NODE_IMAGE_VERSION="${FUND_NODE_IMAGE_VERSION}" \
    -f ./Dockerfile ../..
