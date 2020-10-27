/**
 * Created by Jacob Xie on 10/23/2020.
 */

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { CollectionModule } from "./collection/collection.module"
import { GalleryModule } from "./gallery/gallery.module"
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
import { connDevGallery } from "../resources/config"


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

@Module({
  imports: [
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
