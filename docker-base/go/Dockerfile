# Author: Jacob Bishop

ARG     GO_IMAGE_NAME
ARG     GO_IMAGE_VERSION

FROM    $GO_IMAGE_NAME:$GO_IMAGE_VERSION

# setup mirror image
RUN     go env -w GOPROXY=https://goproxy.io,direct
