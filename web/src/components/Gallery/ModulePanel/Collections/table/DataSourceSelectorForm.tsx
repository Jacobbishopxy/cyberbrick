/**
 * Created by Jacob Xie on 1/4/2021
 */

import { useState } from "react"
import { Button, Form, Radio, Space } from "antd"
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons"
import { FormattedMessage } from "umi"
import _ from "lodash"

import { QuerySelectorModal } from "@/components/Gallery/Dataset"
import { FileExtractModal } from "@/components/FileUploadModal"
import { fileExtract, fileExtractUrl } from "@/components/Gallery/Misc/FileUploadConfig"
import * as DataType from "../../../GalleryDataType"
import { DataSelectedType } from "@/components/Gallery/Utils/data"


export interface DataSourceSelectorFormProps {
  content?: DataType.Content
  saveContent: (content: DataType.Content) => void
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
  dataType?: DataSelectedType
  dataSelected: (v: DataSelectedType) => void
}

/**
 * Table Content data structure:{
 * ...content,
 * storageType: pg/mongodb
 * data{
 *    source: Record(string, any) //this is for the json object to display table
 *    id?: mongodb object id // if storageType is mongodb
 *    collection?: mongodb collection name // if storageType is mongodb
 *    }
 * }
 */
export const DataSourceSelectorForm = (props: DataSourceSelectorFormProps) => {
  const [uploadVisible, setUploadVisible] = useState(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [dataAvailable, setDataAvailable] = useState(false)

  const saveContentData = (data: Record<string, any>) => {

    // console.log(data)
    if (_.isEmpty(data))
      return false

    let storageType
    // let ctt: DataType.Content = { date: DataType.today(), data: {} }
    switch (content?.config?.type) {
      case DataType.flexTableType.file:
        storageType = DataType.StorageType.MONGO
        break;
      case DataType.flexTableType.dataset:
        // console.log(DataType.flexTableType.dataset)
        storageType = DataType.StorageType.PG
        break
      default:
        break;
    }

    const ctt = content ? {
      ...content!,
      storageType: storageType ? storageType : content.storageType,
      date: content.date ? content.date : DataType.today(),
      data: { ...content.data, source: data },
    } : {
      date: DataType.today(),
      data: { source: data },
    }
    setContent(ctt)
    props.saveContent(ctt)
    setDataAvailable(true)

    return true
  }

  const dataSelect = () => {
    if (props.dataType === DataType.flexTableType.dataset)
      return (
        <QuerySelectorModal
          trigger={<Button type="primary">
            <FormattedMessage id="gallery.component.general14" />
          </Button>}
          storagesOnFetch={props.fetchStorages}
          storageOnSelect={props.fetchTableList}
          tableOnSelect={props.fetchTableColumns}
          onSubmit={saveContentData}
          columnsRequired
        />
      )
    if (props.dataType === DataType.flexTableType.file)
      return (
        <>
          <Button
            type="primary"
            onClick={() => setUploadVisible(true)}
          >
            <FormattedMessage id="gallery.component.general26" />
          </Button>

          <FileExtractModal
            setVisible={setUploadVisible}
            visible={uploadVisible}
            uploadAddress={fileExtractUrl}
            upload={fileExtract}
            uploadResHandle={saveContentData}
            multiSheetDisable
          />
        </>
      )
    return (
      <Button type="primary" disabled>
        <FormattedMessage id="gallery.component.general26" />
      </Button>
    )
  }

  return (
    <Form.Item label="Data type">
      <Radio.Group onChange={e => props.dataSelected(e.target.value)}>
        <Radio value={DataType.flexTableType.dataset}>
          <FormattedMessage id="gallery.component.general54" />
        </Radio>
        <Radio value={DataType.flexTableType.file}>
          <FormattedMessage id="gallery.component.general55" />
        </Radio>
      </Radio.Group>
      <Space>
        {dataSelect()}
        {
          dataAvailable ?
            <CheckCircleTwoTone twoToneColor="green" /> :
            <CloseCircleTwoTone twoToneColor="red" />
        }
      </Space>
    </Form.Item>
  )
}

