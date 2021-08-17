#!/usr/bin/env bash

docker-compose down
docker-compose up -d
chmod +x ./create_unique_index.sh