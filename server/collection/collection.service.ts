/**
 * Created by Jacob Xie on 10/26/2020.
 */

import { Injectable } from "@nestjs/common"
import { join } from "path"

@Injectable()
export class CollectionService {

  getDocument = (name: string) =>
    join(__dirname, "../../public", name)

  getAsset = (name: string) =>
    join(__dirname, "../assets", name)
}
