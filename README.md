# REACT DEMO

## Environment Prepare

```
npm i
```
or
```
yarn
```

## Configuration Prepare

In `resources` folder:

1. new `databaseDev.ts` (see [databaseDev.template.ts](resources/databaseDev.template.ts)) for development.

2. new `databaseProd.ts` (see [databaseProd.template.ts](resources/databaseProd.template.ts)) for production.

## Start Project

1. development mode: 

    *  `yarn serve:dev` for server side then in another terminal `yarn dev` for frontend
    
    * if offline mode (no database connection), please use `yarn serve:dev:offline` & `yarn dev:offline`

2. production:

    * `yarn build` then `yarn serve`

## Route

Check [config/config.ts](config/config.ts) for detail.

## Mark

For some detailed project components.

### Gallery

![Data Structure](public/GalleryDataStructure.png)

