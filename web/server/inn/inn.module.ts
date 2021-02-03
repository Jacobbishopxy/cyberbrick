/**
 * Created by Jacob Xie on 2/3/2021
 */

import {Module} from "@nestjs/common"
import {TypeOrmModule} from "@nestjs/typeorm"

import {db} from "./common"
import {Update} from "./entity"
import {UpdateService} from "./provider"
import {UpdateController} from "./controller"


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Update,
    ], db)
  ],
  providers: [
    UpdateService,
  ],
  controllers: [
    UpdateController,
  ]
})
export class InnModule {}

