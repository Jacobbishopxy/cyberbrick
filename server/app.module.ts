/**
 * Created by Jacob Xie on 10/23/2020.
 */

import {Module} from "@nestjs/common"
import {TypeOrmModule} from "@nestjs/typeorm"
import {ServeStaticModule} from "@nestjs/serve-static"
import {Routes, RouterModule} from "nest-router"
import {join} from "path"

import {CollectionModule} from "./collection/collection.module"
import {GalleryModule} from "./gallery/gallery.module"
import {
  Author,
  Category,
  Content,
  Dashboard,
  Element,
  Mark,
  Storage,
  Tag,
  Template,
} from "./gallery/entity"
import {connDevGallery} from "./config"


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

const frontendControl = process.env.NODE_ENV === "production" ?
  [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../frontend")
    })
  ] : []

@Module({
  imports: [
    ...frontendControl,
    RouterModule.forRoutes(routes),
    CollectionModule,
    TypeOrmModule.forRoot({
      ...connDevGallery,
      entities: galleryEntities,
    }),
    GalleryModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

