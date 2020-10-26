/**
 * Created by Jacob Xie on 10/23/2020.
 */

import { Module } from "@nestjs/common"


// import { connDevGallery } from "../resources/config"
import { CollectionModule } from "./collection/collection.module"


@Module({
  imports: [
    CollectionModule
  ]
})
export class AppModule {}
