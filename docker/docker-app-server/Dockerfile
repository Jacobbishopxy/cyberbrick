# Author: Jacob Bishop

ARG     BASE_IMAGE_NAME
ARG     BASE_IMAGE_VERSION

# base
FROM    $BASE_IMAGE_NAME:$BASE_IMAGE_VERSION

# make directory
RUN     mkdir /app

# copy requirements
COPY    ./server/requirements.txt app/requirements.txt

WORKDIR /app

# install requirements
SHELL   ["conda", "run", "-n", "py38", "/bin/bash", "-c"]
RUN     pip install -r requirements.txt

# copy source code to workdir
COPY    ./server app/
