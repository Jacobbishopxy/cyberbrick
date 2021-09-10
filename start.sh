#!/usr/bin/env bash

#get python version from .env
source .env
#production mode
if [ $1 == "prod" ]; then
    cd web
    yarn build
    cd server
    go run . &
    echo -n "$! " > ../.myAppPID
    cd ../server-py
    sh -c "conda run -n $PYTHON_VERSION python wsgi.py --env=prod" &
    echo "$!" >> ../.myAppPID
# default to development mode
else
    cd web
    yarn dev &
    echo -n "$! " > ../.myAppPID
    cd ../server-nodejs
    yarn dev &
    echo "$!" >> ../.myAppPID

fi

cd ../server-py
if [ $1 == "debug" ]; then
    sh -c "conda run -n $PYTHON_VERSION python wsgi.py" &
else
    sh -c "conda run -n $PYTHON_VERSION python wsgi.py --debug=false" &
fi
echo "$!" >> ../.myAppPID
# python3 wsgi.py --debug=false &
# echo "$!" >> ../.myAppPID
