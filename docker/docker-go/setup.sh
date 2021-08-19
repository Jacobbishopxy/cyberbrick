#!/usr/bin/env bash
# author: Celia Xiao

source ../../resources/go.env
docker pull ${GO_IMAGE_NAME}:${GO_IMAGE_VERSION}
docker image tag \
  ${GO_IMAGE_NAME}:${GO_IMAGE_VERSION} ${BASE_IMAGE_NAME}:${BASE_IMAGE_VERSION}
