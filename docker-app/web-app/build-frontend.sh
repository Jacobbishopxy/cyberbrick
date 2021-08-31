#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.web.env
docker build \
    -t "${FRONTEND_WEB_NAME}":"${FRONTEND_WEB_VERSION}" \
    --build-arg FRONTEND_BASE_NAME="${FRONTEND_BASE_NAME}" \
    --build-arg FRONTEND_BASE_VERSION="${FRONTEND_BASE_VERSION}" \
    -f ./Dockerfile.frontend ../..
