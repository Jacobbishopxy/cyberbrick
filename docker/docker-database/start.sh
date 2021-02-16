#!/usr/bin/env bash

source .env
export CONTAINER_NAME=${CONTAINER_NAME}
export VERSION=${VERSION}
export PORT=${PORT}
export PASSWORD=${PASSWORD}
export NETWORK_NAME=${NETWORK_NAME}
docker-compose down
docker-compose -p "${COMPOSE_PROJECT_NAME}" up -d
