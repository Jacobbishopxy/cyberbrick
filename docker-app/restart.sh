#!/usr/bin/env bash
# author: Jacob Bishop

source ../resources/docker.env
docker restart ${CONTAINER_NAME}
