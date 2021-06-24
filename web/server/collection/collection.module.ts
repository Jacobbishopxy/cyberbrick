/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {Module, NestModule, MiddlewareConsumer} from "@nestjs/common"

import {FileManagerService} from "./fileManager.service"
import {CollectionService} from "./collection.service"
import {UploadController} from "./upload.controller"
import {HomeController} from "./home.controller"
import {MiscController} from "./misc.controller"
import {DatabaseController} from "./database.controller"
import {FileManagerMiddleware} from "./fileManager.middleware"
import {FileCyberbrickMiddleware} from "./fileCyberbrick.middleware"


@Module({
  providers: [
    FileManagerService,
    CollectionService,
  ],
  controllers: [
    UploadController,
    HomeController,
    MiscController,
    DatabaseController,
  ]
})
export class CollectionModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(FileManagerMiddleware)
      .forRoutes("/api/fm")

    consumer
      .apply(FileCyberbrickMiddleware)
      .forRoutes("/api/cyberbrick")
  }
}

