#!/usr/bin/env bash

docker exec -it pgdb psql -U postgres -d 'dev' -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
