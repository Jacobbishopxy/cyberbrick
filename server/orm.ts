/**
 * Created by Jacob Xie on 8/15/2020.
 */

import "reflect-metadata"
import express, { Request, Response } from "express"
import { createConnection, ConnectionOptions } from "typeorm"

import { OrmRoute } from "./utils"
import { literature } from './literature/literature'
import { gallery } from "./gallery/gallery"


function createConnectAndGenRoutes(routes: OrmRoute[]) {
  return async (app: express.Express, connectionOptions: ConnectionOptions) =>
    createConnection(connectionOptions).then(async () =>
      routes.forEach(route => {
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


export const literatureConnect = createConnectAndGenRoutes(literature)
export const galleryConnect = createConnectAndGenRoutes(gallery)
