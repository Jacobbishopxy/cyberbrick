#!/usr/bin/env bash
# author: Jacob Bishop
#
# base image of web, including JS deps

source ../../resources/docker.web.env
docker build \
    -t "${FRONTEND_BASE_NAME}":"${FRONTEND_BASE_VERSION}" \
    --build-arg FUND_NODE_IMAGE_NAME="${FUND_NODE_IMAGE_NAME}" \
    --build-arg FUND_NODE_IMAGE_VERSION="${FUND_NODE_IMAGE_VERSION}" \
    -f ./Dockerfile ../..
