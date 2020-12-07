/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {Col, Row} from "antd"

import {generateCommonEditorField, generateCommonPresenterField} from "@/components/Gallery/ModulePanel/Collections/graph/Common"
import {generateLineBarOption} from "@/components/Gallery/ModulePanel/Collections/graph/chartGenerators"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"


const EF = generateCommonEditorField()
const PF = generateCommonPresenterField(generateLineBarOption("bar"))

export default () => {

  const [content, setContent] = useState<DataType.Content | undefined>()

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple()

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (sId: string, tn: string) =>
    GalleryService.databaseGetTableColumns(sId, tn)

  const fetchQueryData = (value: DataType.Content) =>
    GalleryService.read(value.data.id, value.data as GalleryAPI.Read)

  const updateContent = (c: DataType.Content) => {
    console.log(c)
    setContent(c)
    return Promise.resolve()
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
          content={content}
          fetchQueryData={fetchQueryData}
          contentHeight={500}
        />
      </Col>
    </Row>
  )
}

