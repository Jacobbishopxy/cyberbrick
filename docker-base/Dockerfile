# Author: Jacob Bishop

# args from --build-arg
ARG     FUND_IMAGE
ARG     FUND_IMAGE_VERSION

# base
FROM    $FUND_IMAGE:$FUND_IMAGE_VERSION

# make directory
RUN     mkdir /app

# copy package requirements to workdir
COPY    package.json /app
COPY    yarn.lock /app

# change the active directory
WORKDIR /app

# install packages
RUN     yarn

