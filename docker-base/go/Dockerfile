# Author: Jacob Bishop

ARG     GO_IMAGE_NAME
ARG     GO_IMAGE_VERSION

FROM    $GO_IMAGE_NAME:$GO_IMAGE_VERSION

# set timezone
ENV     TZ=Asia/Shanghai
RUN     ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# setup mirror image
RUN     go env -w GOPROXY=https://goproxy.io,direct
