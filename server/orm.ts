/**
 * Created by Jacob Xie on 8/15/2020.
 */

import "reflect-metadata"
import express, { Request, Response } from "express"
import { createConnection, ConnectionOptions } from "typeorm"

import { literature } from './literature/literature'

export async function literatureConnect(app: express.Express, connectionOptions: ConnectionOptions) {
  await createConnection(connectionOptions)
    .then(async () =>
      literature
        .forEach(route => {
            if (route.check)
              app[route.method](route.path, route.check, (req: Request, res: Response, next: Function) =>
                route.action(req, res)
                  .then(() => next)
                  .catch((err: any) => next(err)))
            else
              app[route.method](route.path, (req: Request, res: Response, next: Function) =>
                route.action(req, res)
                  .then(() => next)
                  .catch((err: any) => next(err)))
          }
        )
    )
}
