/**
 * Created by Jacob Xie on 2/3/2021
 */

import {Module} from "@nestjs/common"
import {TypeOrmModule} from "@nestjs/typeorm"

import {db} from "./common"
import {Update, Tag} from "./entity"
import {UpdateService, TagService} from "./provider"
import {UpdateController, TagController} from "./controller"


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Update,
      Tag,
    ], db)
  ],
  providers: [
    UpdateService,
    TagService,
  ],
  controllers: [
    UpdateController,
    TagController,
  ]
})
export class InnModule {}

