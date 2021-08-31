# CYBER BRICK

## Menu

1. [Prerequisites](#Prerequisites)

2. [Environment](#Environment)

3. [Configuration](#Configuration)

4. [Start Project](#Start-Project)

5. [Project Structure](#Project-Sturcture)

6. [Details](#Details)

## Prerequisites

### Server Py [Prerequisites]

1. [Flask](https://palletsprojects.com/p/flask/) Web framework

2. [SqlAlchemy](https://www.sqlalchemy.org/) Database ORM

3. [Pandas](https://pandas.pydata.org/) Data Analysis Library

### Server Go [Prerequisites]

1. [Mux]

1. [Mongo]

### Web [Prerequisites]

1. [Typescript](https://www.typescriptlang.org/) Typed JavaScript

2. [NestJS](https://nestjs.com/) NodeJS framework

3. [Typeorm](https://typeorm.io/) Database ORM

4. [React](https://reactjs.org/) JavaScript library

5. [Ant design pro](https://beta-pro.ant.design/) UI solution

## Environment

### Database [Environment]

Use PostgreSql as default project database (storing config etc.)

- PostgreSql = 10.0, docker commands:

  1. `cd docker/docker-database`

  1. `bash start.sh`

  1. `bash create_database.sh`

Use MongoDB for default non-schema data persistence

- MongoDB, docker commands:

  1. `cd docker-mongodb`

  1. `bash start.sh`

  1. `bash create_unique_index.sh`

### Server [Environment]

versions:

- Python >= 3.8

commands:

1. `cd server`
2. `pip install -r requirements.txt`

### Web [Environment]

versions:

- Node >= 12.13
- npm >= 6.12
- yarn >= 1.22

commands:

1. `cd web`
2. `npm i` or `yarn`

## Configuration

In `resources` folder, new `config.json` (see [config.template.json](resources/config.template.json)).
In `resources` folder, new `go.env` (see [go.template.env](resources/go.template.env).
In `resources` folder, if mongodb is running in another machine, new `mongo.connection.env` (see [mongo.connection.template.env](resources/mongo.connection.template.env).

### ubiquitous-alchemy submodule
If you haven't initialized the submodule before, run `make submodule-init`.
Otherwise, update submodule by running `make submodule-update`.
Then, config the `lura.json` and `ua.auth.env` based on `ua.auth.template.env` (you can simply copy template and rename it).
In `ua.auth.env`, Make sure `DATABASE_URL` is your database connection string. If the database is also running in docker and share the same network with auth-server container, rename the hostname to database's container name. Make sure `INVITATION_PAGE` is the link of cyberbrick frontend link (hostname is localhost in dev mode and the ip-address of server in production mode).
In `lura.json`, rename the endpoints-backends host to the real ip-address.
### Server [Configuration]

todo

### Web [Configuration]

todo

## Start Project

### Server Py [Start Project]

Please `cd server-py` first then run the following commands.

1. development:

   - `python wsgi.py` debug mode

   - `python wsgi.py debug=false` no-debug mode

2. production:

   - `python wsgi.py --env=prod`

3. production (docker):

   - setup python image, only for the first time:

     ```bash
     cd docker/docker-python
     bash setup.sh
     ```

   - setup dependencies installed image, rerun if dependencies updated:

     ```bash
     cd docker/docker-base-server
     bash setup.sh
     ```

   - setup built app image and start a container:

     ```bash
     cd docker/docker-app-server
     bash setup.sh
     bash start.sh
     ```

### Server Go [Start Project]

Please `cd server-go` first then run the following commands.

1. development:

   - `go mod tidy` download deps

   - `go run .` start server

1. production (docker):
   - make sure you have a running `mongoDB` and have executed the bash file `create_unique_index.sh` inside docker-mongodb; a base image built from `docker-go`, a `resources/go.env` file with config similar to `go.template.env`; and a `resources/mongo.connection.env` file with similar config as `mongo.connection.template.env`.
   - You can simply run `make docker-biz-server-setup` and then `make docker-biz-server-start` or:
     - cd docker/docker-biz-server
     - ./setup.sh
     - ./start.sh

### Web [Start Project]

Please `cd web` first then do the following commands.

1. development:

   - `yarn serve:dev` for server side then in another terminal `yarn dev` for frontend

2. production:

   - `yarn build` then `yarn serve`

3. production (docker):

   - setup node image, only for the first time:

     ```bash
     cd docker/docker-node
     bash setup.sh
     ```

   - setup dependencies installed image, rerun if dependencies updated:

     ```bash
     cd docker/docker-base-web
     bash setup.sh
     ```

   - setup built app image and start a container:

     ```bash
     cd docker/docker-app-web
     bash setup.sh
     bash start.sh
     ```

   - `yarn build:backend` & `yarn build:frontend` building up web's server & client respectively

## Project Structure

![Project Structure](doc/ProjectStructure.svg)

## Detail

### Server [Detail]

[README](server/README.md)

### Web [Detail]

[README](web/README.md)
