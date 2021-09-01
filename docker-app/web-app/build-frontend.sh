#!/usr/bin/env bash
# author: Jacob Bishop

# read config
source ../../resources/docker.web.env

# build a prod image. Packaged JS bundles.
docker build \
    -t "${FRONTEND_WEB_NAME}":"${FRONTEND_WEB_VERSION}" \
    --build-arg FRONTEND_BASE_NAME="${FRONTEND_BASE_NAME}" \
    --build-arg FRONTEND_BASE_VERSION="${FRONTEND_BASE_VERSION}" \
    -f ./Dockerfile.frontend ../..

# copy built JS bundles from temporary container to local
docker cp \
    $(docker create --rm "${FRONTEND_WEB_NAME}":"${FRONTEND_WEB_VERSION}"):/app/frontend .
