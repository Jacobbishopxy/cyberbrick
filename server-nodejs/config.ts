/**
 * Created by Jacob Xie on 10/21/2020.
 */

import fs from "fs"
import path from "path"
import {Routes, RouterModule} from "nest-router"
import {TypeOrmModule} from "@nestjs/typeorm"
import {ConfigModule, registerAs} from "@nestjs/config"

import {
  Author,
  Category,
  Content,
  Dashboard,
  Element,
  Mark,
  Storage,
  Tag,
  Template
} from "./gallery/entity"
import {CollectionModule} from "./collection/collection.module"
import {GalleryModule} from "./gallery/gallery.module"
import {
  Update,
  Tag as UpdateTag
} from "./inn/entity"
import {InnModule} from "./inn/inn.module"

const isProd = process.env.NODE_ENV === "production"

/**
 * read config file. If `config.json` not existed, use `config.template.json`
 */
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


/**
 * Global configuration
 */
const configLoad = registerAs("server", () => config)
const configImport = ConfigModule.forRoot({
  load: [configLoad],
  isGlobal: true,
  ignoreEnvFile: true,
})


/**
 * API routes
 */
const routes: Routes = [
  {
    path: "/api",
    module: CollectionModule,
    children: [
      {
        path: "/gallery",
        module: GalleryModule
      },
      {
        path: "/inn",
        module: InnModule
      }
    ]
  }
]
const routerImports = RouterModule.forRoutes(routes)

/**
 * database gallery module
 */
const databaseGalleryConfig = isProd ? config.connProdGallery : config.connDevGallery
const galleryEntities = [
  Author,
  Category,
  Content,
  Dashboard,
  Element,
  Mark,
  Storage,
  Tag,
  Template,
]
const databaseGalleryImports = TypeOrmModule.forRoot({
  ...databaseGalleryConfig,
  entities: galleryEntities,
})

/**
 * database inn module
 */
const databaseInnConfig = config.connInn
const innEntities = [
  Update,
  UpdateTag
]
const databaseInnImports = TypeOrmModule.forRoot({
  ...databaseInnConfig,
  entities: innEntities,
  database: `${path.resolve(__dirname, "..")}/inn/inn.sqlite`
})

export {
  configImport,
  routerImports,
  databaseGalleryImports,
  databaseInnImports
}

