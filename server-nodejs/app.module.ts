/**
 * Created by Jacob Xie on 10/23/2020.
 */

import {Module} from "@nestjs/common"

import {CollectionModule} from "./collection/collection.module"
import {GalleryModule} from "./gallery/gallery.module"
import {InnModule} from "./inn/inn.module"
import {
  configImport,
  routerImports,
  databaseGalleryImports,
  databaseInnImports,
} from "./config"


@Module({
  imports: [
    configImport,
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
export class AppModule {}

