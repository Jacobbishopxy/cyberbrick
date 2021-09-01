# Author: Jacob Bishop

# args from --build-arg
ARG     FUND_IMAGE_NAME
ARG     FUND_IMAGE_VERSION

# base
FROM    $FUND_IMAGE_NAME:$FUND_IMAGE_VERSION

#COPY    ./resources/.condarc /root/.condarc
RUN     conda update -n base -c defaults conda && conda install anaconda
RUN     pip install -U pip

RUN     apt-get update && apt-get upgrade -y && apt-get install -y \
        apt-utils libc6 libstdc++6 libkrb5-3 \
        openssl debconf unixodbc unixodbc-dev tzdata
RUN     apt-get install -y default-libmysqlclient-dev libpq-dev

ENV     DEBIAN_FRONTEND noninteractive
ENV     TZ=Asia/Shanghai
RUN     ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN     dpkg-reconfigure --frontend noninteractive tzdata
RUN     apt-get install -y locales && \
        echo "zh_CN.UTF-8 UTF-8" > /etc/locale.gen && \
        echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
        locale-gen
RUN     apt-get install -y zip unzip
RUN     apt-get install -y python3-dev

RUN     conda create -n py39 python=3.9 -y
SHELL   ["conda", "run", "-n", "py39", "/bin/bash", "-c"]
RUN     conda install pyodbc psycopg2 pymongo \
        fastparquet pyarrow python-snappy libiconv
