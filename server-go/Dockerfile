FROM golang:1.16
WORKDIR /go/src/app
COPY . /go/src/app
RUN go env -w GOPROXY=https://goproxy.cn,direct
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go get -u github.com/gorilla/mux
ENV GO111MODULE=on
ENV GOFLAGS=-mod=vendor
ENV DB_URI "mongodb://root:root@127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb"
ENV DB_NAME "server-go"
ENV DB_COLLECTION_NAME "server-go"

RUN go mod vendor
EXPOSE 8089
RUN go build
CMD ["go","build"]