#!/usr/bin/env bash
source ../../resources/go.env

export APP_IMAGE_NAME=${APP_IMAGE_NAME}
export APP_IMAGE_VERSION=${APP_IMAGE_VERSION}
export CONTAINER_NAME=${CONTAINER_NAME}
export CONTAINER_PORT=${CONTAINER_PORT}
export VOLUME_CONF_EXT=${VOLUME_CONF_EXT}
export VOLUME_CONF_INN=${VOLUME_CONF_INN}
export DB_URI=${DB_URI}
export DB_NAME=${DB_NAME}
export DB_COLLECTION_NAME=${DB_COLLECTION_NAME}

# echo `ls $VOLUME_CONF_EXT`
docker-compose down
docker-compose up -d
