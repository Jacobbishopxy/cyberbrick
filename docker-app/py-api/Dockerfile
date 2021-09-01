# Author: Jacob Bishop

ARG     BASE_IMAGE_NAME
ARG     BASE_IMAGE_VERSION

# base
FROM    $BASE_IMAGE_NAME:$BASE_IMAGE_VERSION

# make directory
RUN     mkdir /server

# copy requirements
COPY    ./server-py/requirements.txt server/requirements.txt

WORKDIR /server

# install requirements
SHELL   ["conda", "run", "-n", "py39", "/bin/bash", "-c"]
RUN     pip install -r requirements.txt

# copy source code to workdir
COPY    ./server-py .
