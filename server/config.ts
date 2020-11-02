/**
 * Created by Jacob Xie on 10/21/2020.
 */

import fs from "fs"
import path from "path"
import {ConnectionOptions} from "typeorm"

const readConfig = () => {
  const configFile = path.join(__dirname, "..", "./resources/config.json")
  let f
  if (fs.existsSync(configFile)) {
    f = fs.readFileSync(configFile)
  } else {
    const templateConfigFile = path.join(__dirname, "..", "./resources/config.template.json")
    f = fs.readFileSync(templateConfigFile)
  }

  return JSON.parse(f.toString())
}

const config = readConfig()

const connDevGallery = config.connDevGallery as ConnectionOptions
const connProdGallery = config.connProdGallery as ConnectionOptions

export {
  connDevGallery,
  connProdGallery
}

