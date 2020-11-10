/**
 * Created by Jacob Xie on 10/21/2020.
 */

import fs from "fs"
import path, {join} from "path"
import {Routes, RouterModule} from "nest-router"
import {ConnectionOptions} from "typeorm"
import {ServeStaticModule} from "@nestjs/serve-static"
import {TypeOrmModule} from "@nestjs/typeorm"
import {Author, Category, Content, Dashboard, Element, Mark, Storage, Tag, Template} from "./gallery/entity"
import {CollectionModule} from "./collection/collection.module"
import {GalleryModule} from "./gallery/gallery.module"


const isProd = process.env.NODE_ENV === "production"

const readConfig = () => {
  const configFile = path.join(__dirname, "../..", "./resources/config.json")
  let f
  if (fs.existsSync(configFile)) {
    f = fs.readFileSync(configFile)
  } else {
    const templateConfigFile = path.join(__dirname, "../..", "./resources/config.template.json")
    f = fs.readFileSync(templateConfigFile)
  }

  return JSON.parse(f.toString())
}

const config = readConfig()

const connDevGallery = config.connDevGallery as ConnectionOptions
const connProdGallery = config.connProdGallery as ConnectionOptions
const connGallery = isProd ? connProdGallery : connDevGallery
const serverPort = config.serverPort as number

/**
 * API routes
 */
const routes: Routes = [
  {
    path: "/api",
    children: [
      {
        path: "collection",
        module: CollectionModule
      },
      {
        path: "gallery",
        module: GalleryModule
      }
    ]
  }
]
const routerImports = RouterModule.forRoutes(routes)

/**
 * frontend static HTML
 */
const staticHTML = isProd ? {rootPath: join(__dirname, "../frontend")} : {}
const frontendImports = ServeStaticModule.forRoot(staticHTML)

/**
 * database module
 */
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
const databaseImports =
  TypeOrmModule.forRoot({
    ...connGallery,
    entities: galleryEntities,
  })


export {serverPort, routerImports, frontendImports, databaseImports}

