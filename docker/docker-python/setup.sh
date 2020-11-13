#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.server.env
docker pull "${PY_IMAGE_NAME}":"${PY_IMAGE_VERSION}"
docker image tag \
  "${PY_IMAGE_NAME}":"${PY_IMAGE_VERSION}" "${FUND_IMAGE_NAME}":"${FUND_IMAGE_VERSION}"
