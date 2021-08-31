#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.web.env
docker restart "${API_CONTAINER_NAME}"
