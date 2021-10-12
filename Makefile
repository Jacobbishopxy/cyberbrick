
instruction:
	@echo "enter 'make dev-nodebug' to start project in development no-debug mode"
	@echo "enter 'make prod' to start app in production mode"
	@echo "enter 'make prod-noset' to start app in production mode without installing dependencies"
	@echo "enter 'make clean' to clean the PID and unbind ports"
	@echo "enter 'make checkPID' to check your running command's PID"
	@echo "enter 'make ua-help' to see the instruction for making ubiquitous-alchemy submodule"

ua-help:
	@echo "enter 'make submodule-init' to initialize submodule for the first time"
	@echo "enter 'make submodule-update' to update submodule"
	@echo "enter 'make docker-auth-base' to deploy auth-server base image"
	@echo "enter 'make docker-auth' to deploy auth-server app image"
	@echo "enter 'make docker-api-gateway-base' to deploy api-gateway base image"
	@echo "enter 'make docker-api-gateway' to deploy api-gatewayr app image"

.PHONY: setup clean checkPID \
dev-nodebug prod \
instruction web-setup \
api-gateway

LURA_PATH=../../resources/lura.json
AUTH_ENV_PATH=../../resources/ua.auth.env
UA_PATH=ubiquitous-alchemy
DOCKER_APP_PATH=docker-app
DOCKER_BASE_PATH=docker-base
DOCKER_GO_MONGO=biz-api
NETWORK=prod

# setup docker network
docker-network-init:
	docker network create ${NETWORK}

# setup environment
setup: web-setup
	./setup.sh
	cd ${DOCKER_BASE_PATH}/postgres && bash start.sh && bash create_database.sh
	cd ${DOCKER_BASE_PATH}/postgres && bash grant_read_all.sh

# the following are for production in localhost (testing)
web-setup:
	cd web && yarn

dev-nodebug: clean
	./start.sh &

dev-debug:
	./start.sh debug &

prod: clean web-setup
	./start.sh prod &

prod-noset: clean
	./start.sh prod &
# building base image
docker-go:
	cd ${DOCKER_BASE_PATH}/go && bash setup.sh

docker-mongodb:
	cd ${DOCKER_BASE_PATH}/mongodb && bash start.sh

docker-node:
	cd ${DOCKER_BASE_PATH}/nodejs && bash setup.sh

docker-python:
	cd ${DOCKER_BASE_PATH}/py && bash setup.sh

# building app image
# biz api (go-mongo-api)
docker-biz-server-base: docker-go docker-mongodb
	cd ${DOCKER_BASE_PATH}/mongodb && ./create_unique_index.sh
	cd ${DOCKER_APP_PATH}/${DOCKER_GO_MONGO} && ./setup.sh

docker-biz-server: docker-biz-server-setup docker-biz-server-start

docker-biz-server-setup:
	cd ${DOCKER_APP_PATH}/${DOCKER_GO_MONGO} && ./setup.sh

docker-biz-server-start:
	cd ${DOCKER_APP_PATH}/${DOCKER_GO_MONGO} && ./start.sh

docker-py-base:
	cd ${DOCKER_APP_PATH}/py-base && ./setup.sh

docker-py-api: docker-py-api-setup docker-py-api-start

docker-py-api-setup:
	cd ${DOCKER_APP_PATH}/py-api && ./setup.sh

docker-py-api-start:
	cd ${DOCKER_APP_PATH}/py-api && ./start.sh

docker-biz-v1-base:
	cd ${DOCKER_APP_PATH}/biz-base-v1 && ./setup.sh

docker-biz-v1: docker-biz-v1-setup docker-biz-v1-start

docker-biz-v1-setup:
	cd ${DOCKER_APP_PATH}/biz-api-v1 && bash setup.sh

docker-biz-v1-start:
	cd ${DOCKER_APP_PATH}/biz-api-v1 && ./start.sh

# the following are targets for submodule ubiquitous-alchemy
# initialize or update submodule
submodule-init:
	cp ./resources/ua.auth.template.env ./resources/ua.auth.env
	git submodule init
	git submodule update
	make submodule-config

submodule-update:
	cd ${UA_PATH} && git pull origin main

# CAUTIOUS! Will override your current env config
submodule-config:
	cp ./resources/lura.env ${UA_PATH}/resources/lura.env
	cp ./resources/ua.auth.env ${UA_PATH}/resources/auth.env
	cp ./resources/ua.gateway.env ${UA_PATH}/resources/gateway.env
	cd ${UA_PATH}/ubiquitous-api-gateway && make env-setup

# for dev mode, running api-gateway
api-gateway:
	cd ${UA_PATH}/ubiquitous-api-gateway && go run main.go -c ${LURA_PATH}

api-gateway-prod:
	cd ${UA_PATH}/ubiquitous-api-gateway && ./ubiquitous-api-gateway -c ${LURA_PATH}

# docker file to deploy api-gateway on docker
# if you have deployed server-go before, there's no need to run this base image
docker-api-gateway-base:
	cd ${UA_PATH}/docker/docker-go && ./setup.sh

docker-api-gateway: docker-api-gateway-setup docker-api-gateway-start

docker-api-gateway-setup:
	cd ${UA_PATH}/docker/docker-api-gateway && ./setup.sh

docker-api-gateway-start:
	cd ${UA_PATH}/docker/docker-api-gateway && ./start.sh

# docker file to deploy auth-server on docker
docker-auth-base:
	cd ${UA_PATH}/docker/docker-rust && ./setup.sh

docker-auth: docker-auth-setup docker-auth-start

docker-auth-setup:
	cd ${UA_PATH}/docker/docker-auth-server && ./setup.sh

docker-auth-start:
	cd ${UA_PATH}/docker/docker-auth-server && ./start.sh

# running auth-server on dev mode
auth-service:
	cd ${UA_PATH}/ubiquitous-auth-server && cargo run -- ${AUTH_ENV_PATH}

clean:
	./clean.sh

checkPID:
	@echo "double check your PID for server"
	ps -ef | grep "python3 wsgi.py --debug=false"
	@echo "double check your PID for web"
	ps -ef | grep yarn
