
instruction:
	@echo "enter 'make dev-nodebug' to start project in development no-debug mode"
	@echo "enter 'make prod' to start app in production mode"
	@echo "enter 'make prod-noset' to start app in production mode without installing dependencies"
	@echo "enter 'make clean' to clean the PID and unbind ports"
	@echo "enter 'make checkPID' to check your running command's PID"

.PHONY: setup clean checkPID \
dev-nodebug prod \
instruction web-setup \



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
