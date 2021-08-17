# Author: Celia Bishop

ARG     BASE_IMAGE_NAME
ARG     BASE_IMAGE_VERSION

FROM $BASE_IMAGE_NAME:$BASE_IMAGE_VERSION
WORKDIR /go/src/app
EXPOSE 8089

RUN go env -w GOPROXY=https://goproxy.cn,direct
Run go env -w GO111MODULE=on

COPY ./server-go /go/src/app
RUN go mod tidy

RUN go build
