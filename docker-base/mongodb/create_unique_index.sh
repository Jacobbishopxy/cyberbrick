#!/usr/bin/env bash

source .env
export -a dbnames=${DB_COLLECTION_NAME}

#create user
docker exec -i mongodb mongo -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} ${MONGO_INITDB_DATABASE} << EOF
db.createUser( {user: "${ADMIN_USERNAME}",pwd: "${ADMIN_PASSWORD}",roles: [ { role: "userAdminAnyDatabase", db: "${MONGO_INITDB_DATABASE}" } ]});
EOF

#create unique index
for coll in "${dbnames[@]}"
do
    echo "creating index for ${coll}"
    docker exec -i mongodb mongo -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} ${MONGO_INITDB_DATABASE} << EOF
use ${DB_NAME};
db.${coll}.createIndex({elementId:1,date:1},{unique:true});
EOF
done



