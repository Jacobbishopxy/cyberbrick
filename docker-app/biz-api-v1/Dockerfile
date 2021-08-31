# Author: Jacob Bishop

ARG     API_BASE_V1_NAME
ARG     API_BASE_V1_VERSION

# base
FROM    $API_BASE_V1_NAME:$API_BASE_V1_VERSION

# copy source code to workdir
COPY    ./server-nodejs /app

# change the active directory
WORKDIR /app

# build app
RUN     yarn build

