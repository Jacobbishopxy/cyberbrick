# Author: Jacob Bishop

# args from --build-arg
ARG     FUND_NODE_IMAGE_NAME
ARG     FUND_NODE_IMAGE_VERSION

# base
FROM    $FUND_NODE_IMAGE_NAME:$FUND_NODE_IMAGE_VERSION

# set timezone
ENV     TZ=Asia/Shanghai
RUN     ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# make directory
RUN     mkdir /app

# copy web package requirements to workdir
COPY    web/package.json /app
COPY    web/yarn.lock /app

# switch source
#RUN     yarn config set registry https://registry.npm.taobao.org/

# change the active directory
WORKDIR /app

# install packages
RUN     yarn
