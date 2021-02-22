# CYBER BRICK

## Menu

1. [Prerequisites](#Prerequisites)

2. [Environment](#Environment)

3. [Configuration](#Configuration)

4. [Start Project](#Start-Project)

5. [Project Structure](#Porject-Sturcture)

6. [Details](#Details)

## Prerequisites

### Server [Prerequisites]

1. [Flask](https://palletsprojects.com/p/flask/) Web framework

2. [SqlAlchemy](https://www.sqlalchemy.org/) Database ORM

3. [Pandas](https://pandas.pydata.org/) Data Analysis Library

### Web [Prerequisites]

1. [Typescript](https://www.typescriptlang.org/) Typed JavaScript

2. [NestJS](https://nestjs.com/) NodeJS framework

3. [Typeorm](https://typeorm.io/) Database ORM

4. [React](https://reactjs.org/) JavaScript library

5. [Ant design pro](https://beta-pro.ant.design/) UI solution

## Environment

### Database [Environment]

Use PostgreSql as default project database (storing config etc.)

version:

- PostgreSql = 10.0

docker commands:

1. `cd docker/docker-database`
2. `bash start.sh`
3. `bash create_database.sh`

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

### Server [Configuration]

todo

### Web [Configuration]

todo

## Start Project

### Server [Start Project]

Please `cd server` first then do the following commands.

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
