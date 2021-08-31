# Author: Jacob Bishop

# args from --build-arg
ARG     FUND_NODE_IMAGE_NAME
ARG     FUND_NODE_IMAGE_VERSION

# base
FROM    $FUND_NODE_IMAGE_NAME:$FUND_NODE_IMAGE_VERSION

# make directory
RUN     mkdir /app

# copy package requirements to workdir
COPY    server-nodejs/package.json /app
COPY    server-nodejs/yarn.lock /app

# switch source
#RUN     yarn config set registry https://registry.npm.taobao.org/

# change the active directory
WORKDIR /app

# install packages
RUN     yarn
