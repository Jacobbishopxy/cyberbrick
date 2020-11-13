#!/usr/bin/env bash
# author: Jacob Bishop

source ../../resources/docker.web.env
export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}
export APP_IMAGE_NAME=${APP_IMAGE_NAME}
export APP_IMAGE_VERSION=${APP_IMAGE_VERSION}
export CONTAINER_NAME=${CONTAINER_NAME}
export CONTAINER_PORT=${CONTAINER_PORT}
export APP_PORT=${APP_PORT}
docker-compose down
docker-compose -p "${COMPOSE_PROJECT_NAME}" up -d
