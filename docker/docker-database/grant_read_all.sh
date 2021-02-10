#!/usr/bin/env bash

docker exec -it pgdb psql -h 'localhost' -U 'dev_admin' -d 'dev' -c 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO dev_reader;'
