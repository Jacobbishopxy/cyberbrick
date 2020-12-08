#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.server.env
export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}
export APP_IMAGE_NAME=${APP_IMAGE_NAME}
export APP_IMAGE_VERSION=${APP_IMAGE_VERSION}
export CONTAINER_NAME=${CONTAINER_NAME}
export CONTAINER_PORT=${CONTAINER_PORT}
export VOLUME_CONF_EXT=${VOLUME_CONF_EXT}
export VOLUME_CONF_INN=${VOLUME_CONF_INN}
export APP_PORT=${APP_PORT}
docker-compose down
docker-compose -p "${COMPOSE_PROJECT_NAME}" up -d
