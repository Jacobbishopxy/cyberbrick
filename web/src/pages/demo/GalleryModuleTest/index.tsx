/**
 * Created by Jacob Xie on 1/17/2021
 */

import { useEffect, useRef, useState } from "react"
import { Card, Switch } from "antd"
import { FormattedMessage } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"
import { ConvertFwRef } from "@/components/Gallery/ModulePanel/Generator/data"
import styles from "@/components/Gallery/ModulePanel/Panel/Common.less"

import { Pie } from "@/components/Gallery/ModulePanel/Collections/graph"
import { TargetPrice } from "@/components/Gallery/ModulePanel/Collections/miscellaneous/TargetPrice"
import { Text } from "@/components/Gallery/ModulePanel/Collections/multiMedia/Text"
import { Line } from '@/components/Gallery/ModulePanel/Collections/graph/Line'
import { Bar } from '@/components/Gallery/ModulePanel/Collections/graph/Bar'
import { Scatter } from '@/components/Gallery/ModulePanel/Collections/graph/Scatter'
import { FlexTable } from '@/components/Gallery/ModulePanel/Collections/table/FlexTable'
import SpreadJsTest from '@/components/SpreadJS'
import ImportAndExport from '@/components/SpreadJS/importAndExport.jsx'
export default () => {

  const moduleFwRef = useRef<ConvertFwRef>(null)

  const [content, setContent] = useState<DataType.Content | undefined>({})

  const switchOnClick = (v: boolean) => {
    if (moduleFwRef.current) moduleFwRef.current.setEdit(v)
  }

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (storageId: string, tableName: string) =>
    GalleryService.databaseGetTableColumns(storageId, tableName)

  const fetchQueryData = (value: DataType.Content) => {
    const id = value.data?.id
    const option = value.data as DataType.Read
    return GalleryService.read(id, option)
  }

  useEffect(() => {
    console.log(45, content)
  }, [content])

  return (
    <Card
      title={<FormattedMessage id="gallery.page.demo.module-test.title" />}
      extra={
        <Switch
          onClick={switchOnClick}
        />
      }
      style={{ height: "85vh" }}
      bodyStyle={{ height: "100%" }}
    >
      <SpreadJsTest></SpreadJsTest>
      {/* <ImportAndExport></ImportAndExport> */}
      {/* <FlexTable
        ref={moduleFwRef}
        content={content}
        setContent={setContent}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        fetchQueryData={fetchQueryData}
        updateContent={setContent}
        contentHeight={750}>
      </FlexTable> */}
      {/* <Scatter
        ref={moduleFwRef}
        content={content}
        setContent={setContent}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        fetchQueryData={fetchQueryData}
        updateContent={setContent}
        contentHeight={750}
      /> */}


      {/* <TargetPrice
        ref={moduleFwRef}
        content={content}
        setContent={setContent}
      ></TargetPrice> */}
      {/* <Text
        ref={moduleFwRef}
        content={content}
        setContent={setContent}
      ></Text> */}
      {/* <Line
        content={content}
        setContent={setContent}
        ref={moduleFwRef}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        fetchQueryData={fetchQueryData}

      ></Line> */}
      {/* <Bar
        content={content}
        setContent={setContent}
        ref={moduleFwRef}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        fetchQueryData={fetchQueryData}

      ></Bar> */}
    </Card>
  )
}

