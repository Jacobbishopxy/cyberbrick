/**
 * Created by Jacob Xie on 11/25/2020
 */

import ProForm from "@ant-design/pro-form"

import {SelectorConditionItems} from "@/components/Gallery/Dataset/QuerySelector/SelectorConditionItems"

import {QuerySelectorForm} from "@/components/Gallery/Dataset"
import {GalleryDataType} from "@/components/Gallery"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"



const mockColOpt = [
  {
    label: "Sam",
    value: "Sam",
  },
  {
    label: "MZ",
    value: "MZ",
  },
  {
    label: "Jacob",
    value: "Jacob",
  },
]


export default () => {
  return (
    <ProForm onFinish={async (v) => console.log(v)}>
      <SelectorConditionItems columnOptions={mockColOpt} />
    </ProForm>
  )

  // const fetchStorages = () =>
  //   GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  // const fetchTableList = (id: string) =>
  //   GalleryService.databaseListTable(id)

  // const fetchTableColumns = (storageId: string, tableName: string) =>
  //   GalleryService.databaseGetTableColumns(storageId, tableName)

  // return (
  //   <QuerySelectorForm
  //     storagesOnFetch={fetchStorages}
  //     storageOnSelect={fetchTableList}
  //     tableOnSelect={fetchTableColumns}
  //     onSubmit={v => console.log(v)}
  //   />
  // )
}

