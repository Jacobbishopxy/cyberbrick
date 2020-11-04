/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {Injectable} from "@nestjs/common"
import {join} from "path"
import fs from "fs"

const publicPath = "../../public"
const assetsPath = "../assets"
const unicorns = fs.readdirSync(join(__dirname, `${publicPath}/unicorn`))

@Injectable()
export class CollectionService {

  getDocument = (name: string) =>
    join(__dirname, `${publicPath}/document`, name)

  getUnicorn = (name: string) =>
    join(__dirname, `${publicPath}/unicorn`, name)

  getRandomUnicorn = () => {
    const name = unicorns[Math.floor(Math.random() * unicorns.length)]
    return this.getUnicorn(name)
  }

  getAsset = (name: string) =>
    join(__dirname, assetsPath, name)
}
