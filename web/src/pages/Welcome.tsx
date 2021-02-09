/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React from "react"
import {Typography} from "antd"
import {FormattedMessage} from "umi"

import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1"
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager"

import {GenericArticle, GenericTag} from "@/components/Article/data"
import {Article} from "@/components/Article"
import * as innService from "@/services/inn"

const getArticles = (pagination?: [number, number]) =>
  innService.getLatestUpdate(pagination) as Promise<GenericArticle[]>

const getTags = () =>
  innService.getAllTag() as Promise<GenericTag[]>

const modifyArticle = (v: GenericArticle) =>
  innService.saveUpdate(v as InnAPI.Update)

const deleteArticle = (v: string) =>
  innService.deleteUpdate(v)

const modifyTags = (v: GenericTag[]) =>
  innService.modifyTags(v as InnAPI.Tag[])


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "/api/cyberbrick",
}

export default () => {

  return (
    <Typography>
      <Typography.Title>
        <FormattedMessage id="pages.welcome.title1"/>
      </Typography.Title>

      <Article
        getArticles={getArticles}
        getTags={getTags}
        modifyArticle={modifyArticle}
        deleteArticle={deleteArticle}
        modifyTags={modifyTags}
      />

      <Typography.Title>
        <FormattedMessage id="pages.welcome.title2"/>
      </Typography.Title>

      <FileManager style={{height: '60vh'}}>
        <FileNavigator
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    </Typography>
  )
}

