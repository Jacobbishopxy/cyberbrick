/**
 * Created by Jacob Xie on 10/23/2020.
 */

import {Module} from "@nestjs/common"

import {CollectionModule} from "./collection/collection.module"
import {GalleryModule} from "./gallery/gallery.module"
import {routerImports, frontendImports, databaseImports} from "./config"


@Module({
  imports: [
    frontendImports,
    routerImports,
    CollectionModule,
    databaseImports,
    GalleryModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

