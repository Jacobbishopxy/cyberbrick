# CYBER BRICK

## Prerequisites

### Server

1. [Flask](https://palletsprojects.com/p/flask/) Web framework

2. [SqlAlchemy](https://www.sqlalchemy.org/) Database ORM

3. [Pandas](https://pandas.pydata.org/) Data Analysis Library

### Web

1. [Typescript](https://www.typescriptlang.org/) Typed JavaScript

2. [NestJS](https://nestjs.com/) NodeJS framework

3. [Typeorm](https://typeorm.io/) Database ORM

4. [React](https://reactjs.org/) JavaScript library

5. [Ant design pro](https://beta-pro.ant.design/) UI solution

## Environment Prepare

### Server

Python version: 3.8

1. `cd server`
2. `pip install -r requirements.txt`

### Web

Please `cd web` first then do the following commands.

`npm i` or `yarn`

## Configuration Prepare

### Server

todo

### Web

1. In `resources` folder, new `config.json` (see [config.template.json](resources/config.template.json)). 
If file not supplied, system would automatically read `config.template.json`.

## Start Project

### Server

Please `cd server` first then do the following commands.

1. development mode:

    * `python wsgi.py`

2. production:

    * `python wsgi.py --env=prod`

3. production (docker):

    todo

### Web

Please `cd web` first then do the following commands.

1. development mode: 

    * `yarn serve:dev` for server side then in another terminal `yarn dev` for frontend
    
2. production:

    * `yarn build` then `yarn serve`
    
3. production (docker):

    * setup node image, only for the first time:
      ```
      cd docker-node
      bash setup.sh
      ```
    
    * setup dependencies installed image, rerun if dependencies updated:
      ```
      cd docker-base
      bash setup.sh
      ```
      
    * setup built app image and start a container:
      
      ```
      cd ../docker-app
      bash setupt.sh
      bash start.sh
      ```

    * `yarn build:backend` & `yarn build:frontend` building up server & client respectively

## Detail

### Server

[README](server/README.md)

### Web

[README](web/README.md)
