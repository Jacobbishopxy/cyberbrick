/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {Injectable} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import {resolve} from "path"
import fs from "fs"


@Injectable()
export class CollectionService {
  constructor(private configService: ConfigService) {}

  private getPublicPath = () =>
    this.configService.get("general").path

  getDocument = (name: string) =>
    resolve(__dirname, `${this.getPublicPath()}/document`, name)

  getUnicorn = (name: string) =>
    resolve(__dirname, `${this.getPublicPath()}/unicorn`, name)

  getRandomUnicorn = () => {
    const pp = this.getPublicPath()
    const unicorns = fs.readdirSync(resolve(pp, "unicorn"))
    const name = unicorns[Math.floor(Math.random() * unicorns.length)]
    return this.getUnicorn(name)
  }

  getFavicon = () =>
    resolve(__dirname, `${this.getPublicPath()}/favicon.ico`)

  getManualImage = (name: string) =>
    resolve(__dirname, `${this.getPublicPath()}/manual`, name)
}
