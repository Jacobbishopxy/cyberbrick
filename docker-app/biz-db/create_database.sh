#!/usr/bin/env bash

source .env
export CONTAINER_NAME=${CONTAINER_NAME}
export USER=${USER}
export PASSWORD=${PASSWORD}
export DB_SETS=${DB_SETS}

for DB in $(echo ${DB_SETS} | tr "," "\n")
do
    echo "create database ${DB}"

    # create database
    if docker exec -it "${CONTAINER_NAME}" psql -U postgres -c "CREATE DATABASE ${DB};"; then
        echo "create database ${DB} success"
        # grant all privileges
        docker exec -it "${CONTAINER_NAME}" psql -U postgres -d "${DB}" -c "GRANT CONNECT ON DATABASE ${DB} TO ${USER}; GRANT USAGE ON SCHEMA public TO ${USER}; GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${USER}; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${USER}; GRANT ALL PRIVILEGES ON DATABASE ${DB} TO ${USER};"

        # add uuid extension
        docker exec -it "${CONTAINER_NAME}" psql -U postgres -d "${DB}" -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    else
        echo "create database ${DB} failed"
    fi

done
