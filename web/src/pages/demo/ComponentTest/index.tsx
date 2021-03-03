/**
 * Created by Jacob Xie on 11/25/2020
 */

import {QuerySelectorForm} from "@/components/Gallery/Dataset"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"


export default () => {

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (storageId: string, tableName: string) =>
    GalleryService.databaseGetTableColumns(storageId, tableName)

  return (
    <QuerySelectorForm
      storagesOnFetch={fetchStorages}
      storageOnSelect={fetchTableList}
      tableOnSelect={fetchTableColumns}
      onSubmit={v => console.log(v)}
    />
  )
}

