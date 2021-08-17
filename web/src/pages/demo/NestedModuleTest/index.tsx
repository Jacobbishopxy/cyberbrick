/**
 * Created by Celia Xiao on 7/21/2021
 */

import { useRef, useState } from "react"
import { Card, Switch } from "antd"
import { FormattedMessage } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"
import { ConvertFwRef } from "@/components/Gallery/ModulePanel/Generator/data"
import styles from "@/components/Gallery/ModulePanel/Panel/Common.less"

import { NestedSimpleModule } from "./NestedModule"


export default () => {

  const moduleFwRef = useRef<ConvertFwRef>(null)

  const [content, setContent] = useState<DataType.Content>()

  const switchOnClick = (v: boolean) => {
    if (moduleFwRef.current) moduleFwRef.current.edit(v)
  }

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (storageId: string, tableName: string) =>
    GalleryService.databaseGetTableColumns(storageId, tableName)

  const fetchQueryData = (value: DataType.Content) => {
    const id = value.data.id
    const option = value.data as DataType.Read
    const storageType = value.storageType || DataType.StorageType.PG
    return GalleryService.read(id, option, storageType)
  }

  const updateContent = (c: DataType.Content) => {
    setContent(c)
    // console.log(c)
  }
  return (
    <Card
      title={<FormattedMessage id="gallery.page.demo.module-test.title" />}
      extra={
        <Switch
          onClick={switchOnClick}
        />
      }
      // style={{ height: "85vh" }}
      bodyStyle={{ height: "100%" }}
    >
      <NestedSimpleModule
        content={content}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        fetchQueryData={fetchQueryData}
        updateContent={updateContent}
        contentHeight={750}
        styling={styles}
        ref={moduleFwRef}
      />
    </Card>
  )
}

