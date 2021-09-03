#!/usr/bin/env bash

source .env

echo $PYTHON_VERSION

cd server-py && sh -c "conda run -n $PYTHON_VERSION pip install -r requirements.txt"
