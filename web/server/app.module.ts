/**
 * Created by Jacob Xie on 10/23/2020.
 */

import { Module } from "@nestjs/common"

import { CollectionModule } from "./collection/collection.module"
import { GalleryModule } from "./gallery/gallery.module"
import { InnModule } from "./inn/inn.module"
import {
  configImport,
  routerImports,
  frontendImports,
  databaseGalleryImports,
  databaseInnImports,
} from "./config"


@Module({
  imports: [
    configImport,
    frontendImports,
    routerImports,
    CollectionModule,
    databaseGalleryImports,
    GalleryModule,
    databaseInnImports,
    InnModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule { }

