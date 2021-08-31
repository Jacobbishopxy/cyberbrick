#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.web.env

docker pull "${NODE_IMAGE_NAME}":"${NODE_IMAGE_VERSION}"
docker image tag \
  "${NODE_IMAGE_NAME}":"${NODE_IMAGE_VERSION}" "${FUND_NODE_IMAGE_NAME}":"${FUND_NODE_IMAGE_VERSION}"
