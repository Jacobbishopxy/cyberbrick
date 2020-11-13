# Author: Jacob Bishop

# args from --build-arg
ARG     FUND_IMAGE_NAME
ARG     FUND_IMAGE_VERSION

# base
FROM    $FUND_IMAGE_NAME:$FUND_IMAGE_VERSION

COPY    ./resources/.condarc /root/.condarc
#RUN     conda update conda && conda update anaconda
#RUN     pip install -U pip
RUN     conda install python=3.8 -y
RUN     conda install pyodbc psycopg2 requests pymongo -y
RUN     apt-get update -y && apt-get install -y \
        libc6 libstdc++6 libkrb5-3 libcurl3 \
        openssl debconf unixodbc unixodbc-dev tzdata

ENV     DEBIAN_FRONTEND noninteractive
ENV     TZ=Asia/Shanghai
RUN     ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN     dpkg-reconfigure --frontend noninteractive tzdata
RUN     apt-get install -y locales && \
        echo "zh_CN.UTF-8 UTF-8" > /etc/locale.gen && \
        echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
        locale-gen
RUN     conda install -y fastparquet pyarrow python-snappy
RUN     apt-get install -y zip unzip

RUN     conda install -c conda-forge libiconv uwsgi
RUN     apt-get -y install libpq-dev python3-dev


