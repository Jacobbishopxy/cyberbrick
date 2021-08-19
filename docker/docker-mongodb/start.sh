#!/usr/bin/env bash

docker-compose down
docker-compose up -d
# chmod +x ./create_unique_index.sh

# generate connection string
source .env
echo "DB_URL=\"mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGODB_CONTAINER_NAME}:27017/?compressors=disabled&gssapiServiceName=mongodb\"" > ../../resources/mongo.connection.env
echo "DB_LOCALHOST_URL=\"mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/?compressors=disabled&gssapiServiceName=mongodb\"" >> ../../resources/mongo.connection.env
