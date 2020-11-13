#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.env
docker pull "${NODE_IMAGE}":"${NODE_IMAGE_VERSION}"
docker image tag \
  "${NODE_IMAGE}":"${NODE_IMAGE_VERSION}" "${FUND_IMAGE}":"${FUND_IMAGE_VERSION}"
