/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from "react"

import {GenericArticle, GenericTag} from "@/components/Article/data"
import {Article} from "@/components/Article"
import * as innService from "@/services/inn"

const getArticles = (pagination?: [number, number]) =>
  innService.getLatestUpdate(pagination) as Promise<GenericArticle[]>

const getTags = () =>
  innService.getAllTag() as Promise<GenericTag[]>

const modifyArticle = (v: GenericArticle) =>
  innService.saveUpdate(v as InnAPI.Update)

const modifyTags = (v: GenericTag[]) =>
  innService.modifyTags(v as InnAPI.Tag[])

export default () => {

  return (
    <Article
      getArticles={getArticles}
      getTags={getTags}
      modifyArticle={modifyArticle}
      modifyTags={modifyTags}
      title={"更新记录"}
    />
  )
}

