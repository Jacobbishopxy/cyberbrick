# CYBER BRICK

## Prerequisites

### Server

todo

### Web

1. [nestjs](https://nestjs.com/) NodeJS framework

2. [typeorm](https://typeorm.io/) Database ORM

3. [react](https://reactjs.org/) JavaScript library

4. [ant design pro](https://beta-pro.ant.design/) UI solution

## Environment Prepare

### Server

todo

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

todo

### Web

Please `cd web` first then do the following commands.

1. development mode: 

    * `yarn serve:dev` for server side then in another terminal `yarn dev` for frontend
    
    * if offline mode (no database connection), please use `yarn serve:dev:offline` & `yarn dev:offline`

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

## Route

Check [config/config.ts](web/config/config.ts) for detail.

## Mark

For some detailed project components.

### Gallery

![Data Structure](web/public/GalleryDataStructure.svg)

