/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {Injectable} from "@nestjs/common"
import {join} from "path"

@Injectable()
export class CollectionService {

  private publicPath = "../../public"
  private assetsPath = "../assets"

  getDocument = (name: string) =>
    join(__dirname, `${this.publicPath}/document`, name)

  getUnicorn = (name: string) =>
    join(__dirname, `${this.publicPath}/unicorn`, name)

  getAsset = (name: string) =>
    join(__dirname, this.assetsPath, name)
}
