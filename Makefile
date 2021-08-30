
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

#set up environment
setup: web-setup
	chmod +x setup.sh start.sh clean.sh
	./setup.sh
	cd docker/docker-database && bash start.sh && bash create_database.sh

#the following are for production in localhost (testing)
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

docker-go:
	cd docker/docker-go && chmod +x setup.sh && bash setup.sh

docker-mongodb:
	cd docker/docker-mongodb && chmod +x start.sh && bash start.sh

docker-biz-server-base: docker-go docker-mongodb
	cd docker/docker-mongodb && ./create_unique_index.sh
	cd docker/docker-biz-server && chmod +x setup.sh start.sh && ./setup.sh

docker-biz-server-setup:
	cd docker/docker-biz-server && ./setup.sh

docker-biz-server-start:
	cd docker/docker-biz-server && ./start.sh

# the following are targets for submodule ubiquitous-alchemy
# initialize or update submodule
submodule-init:
	git submodule init
	git submodule update
	cd ${UA_PATH}/resources && cp auth.template.env auth.env && cp go.template.env go.env

submodule-update:
	cd ${UA_PATH} && git pull origin main

# CAUTIOUS! May override your current env config
env-setup:
	cp ./resources/lura.json ${UA_PATH}/resources/lura.json
	cp ./resources/ua.auth.env ${UA_PATH}/resources/auth.env
	cp ./resources/gateway.env ${UA_PATH}/resources/gateway.env

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

#The following are for docker production, not working because of unmatched dependencies

# # the following are for production in docker
# docker: serverStart webStart


# #setup node image, only for the first time:
# nodeImage:
# 	cd docker/docker-node && bash setup.sh

# #setup dependencies installed image, rerun if dependencies updated:
# setDepend: $(SOURCEWEB) $(WEBENV)
# 	cd docker/docker-base-web && bash setup.sh

# #setup built app image and start a container:
# webImage: $(SOURCEWEB) $(WEBENV)
# 	cd ./docker/docker-app-web && bash setup.sh && bash start.sh

# #this is the target to start the production in docker
# webStart: setDepend webImage
# 	yarn build:backend
# 	yarn build:frontend

# #setup python image, only for the first time:
# ServerImage:
# 	cd docker/docker-python && bash setup.sh

# #setup dependencies installed image, rerun if dependencies updated:
# ServerSetDepend: $(SOURCESERVER) $(SERVERENV)
# 	cd docker/docker-base-server && bash setup.sh

# #setup built app image and start a container:
# serverStart: $(SOURCESERVER) $(SERVERENV) ServerImage ServerSetDepend
# 	cd docker/docker-app-server && bash setup.sh && bash start.sh

clean:
	./clean.sh

checkPID:
	@echo "double check your PID for server"
	ps -ef | grep "python3 wsgi.py --debug=false"
	@echo "double check your PID for web"
	ps -ef | grep yarn
