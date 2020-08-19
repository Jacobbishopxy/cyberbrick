/**
 * Created by Jacob Xie on 8/15/2020.
 */

import "reflect-metadata"
import express, { Request, Response } from "express"
import { createConnection, ConnectionOptions } from "typeorm"

import { literature } from './literature/literature'

const connectionOptions: ConnectionOptions = {
  "name": "default",
  "type": "sqlite",
  "database": `./cache/database.sqlite`,
  "synchronize": true,
  "logging": false,
  "entities": [
    `${ __dirname }/literature/entities/*.ts`
  ],
}

export async function postCategoryConnect(app: express.Express) {
  await createConnection(connectionOptions)
    .then(async () =>
      literature
        .forEach(route =>
          app[route.method](route.path, (req: Request, res: Response, next: Function) =>
            route.action(req, res)
              .then(() => next)
              .catch((err: any) => next(err))
          )
        )
    )
}
