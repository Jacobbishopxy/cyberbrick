####################################################################################################
## Builder
####################################################################################################

FROM    rustlang/rust:nightly AS builder

# Switch to another proxy mirror image (optional)
COPY    ./sources.list /etc/apt/sources.list

RUN     apt install apt-transport-https ca-certificates
RUN     update-ca-certificates
RUN     apt-get update && apt-get upgrade -y

# Create appuser
ENV     USER=docker
ENV     UID=10001

RUN     adduser \
        --disabled-password \
        --gecos "" \
        --home "/nonexistent" \
        --shell "/sbin/nologin" \
        --no-create-home \
        --uid "${UID}" \
        "${USER}"
