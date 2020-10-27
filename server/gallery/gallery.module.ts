/**
 * Created by Jacob Xie on 10/26/2020.
 */

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { db } from "./common"

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
} from "./entity"
import {
  CategoryService,
  ContentService,
  DashboardService,
  ElementService,
  MarkService,
  StorageService,
  TagService,
  TemplateService,
} from "./provider"
import { StorageSubscriber } from "./subscriber"
import {
  CategoryController,
  ContentController,
  DashboardController,
  ElementController,
  MarkController,
  StorageController,
  TagController,
  TemplateController,
} from "./controller"


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Author,
      Category,
      Content,
      Dashboard,
      Element,
      Mark,
      Storage,
      Tag,
      Template,
    ], db)
  ],
  providers: [
    CategoryService,
    ContentService,
    DashboardService,
    ElementService,
    MarkService,
    StorageService,
    TagService,
    TemplateService,
    StorageSubscriber,
  ],
  controllers: [
    CategoryController,
    ContentController,
    DashboardController,
    ElementController,
    MarkController,
    StorageController,
    TagController,
    TemplateController,
  ],
})
export class GalleryModule {}

