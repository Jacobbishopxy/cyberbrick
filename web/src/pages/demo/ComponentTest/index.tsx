/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {Col, Row} from "antd"

import {generateCommonEditorField, generateCommonPresenterField} from "@/components/Gallery/ModulePanel/Collections/graph/Common"
import {generateLineBarOption} from "@/components/Gallery/ModulePanel/Collections/graph/chartUtils"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"


const EF = generateCommonEditorField(true)
const PF = generateCommonPresenterField(generateLineBarOption())

export default () => {

  const [content, setContent] = useState<DataType.Content | undefined>()

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple()

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (sId: string, tn: string) =>
    GalleryService.databaseGetTableColumns(sId, tn)

  const updateContent = (c: DataType.Content) => {
    console.log(c)
    setContent(c)
    return Promise.reject()
  }

  return (
    <Row>
      <Col span={12}>
        <EF
          content={content}
          fetchStorages={fetchStorages}
          fetchTableList={fetchTableList}
          fetchTableColumns={fetchTableColumns}
          updateContent={updateContent}
        />
      </Col>
      <Col span={12}>
        <PF
          // content={content}
          // fetchQueryData={}
        />
      </Col>
    </Row>
  )
}

