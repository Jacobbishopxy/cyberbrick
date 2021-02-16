#!/usr/bin/env bash

source .env
export CONTAINER_NAME=${CONTAINER_NAME}
export USER=${USER}
export PASSWORD=${PASSWORD}
export DB=${DB}

# create user
docker exec -it "${CONTAINER_NAME}" psql -U postgres -c "CREATE USER ${USER} WITH PASSWORD '${PASSWORD}';"

# create database
docker exec -it "${CONTAINER_NAME}" psql -U postgres -c "CREATE DATABASE ${DB};"

# grant all privileges
docker exec -it "${CONTAINER_NAME}" psql -U postgres -d "${DB}" -c "GRANT CONNECT ON DATABASE ${DB} TO ${USER}; GRANT USAGE ON SCHEMA public TO ${USER}; GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${USER}; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${USER}; GRANT ALL PRIVILEGES ON DATABASE ${DB} TO ${USER};"

# add uuid extension
docker exec -it "${CONTAINER_NAME}" psql -U postgres -d "${DB}" -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
