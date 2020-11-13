# Author: Jacob Bishop

ARG     BASE_IMAGE_NAME
ARG     BASE_IMAGE_VERSION

# base
FROM    $BASE_IMAGE_NAME:$BASE_IMAGE_VERSION

# copy source code to workdir
COPY    ./web /app

# change the active directory
WORKDIR /app

# build app
RUN     yarn build

