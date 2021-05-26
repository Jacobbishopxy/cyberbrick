/**
 * Created by Jacob Xie on 11/23/2020
 */


import {Dataset} from "@/components/Gallery/Dataset"
import {fileInsert, fileInsertUrl} from "@/components/Gallery/Misc/FileUploadConfig"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"


export default () => {

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple()

  const storageOnSelect = (id: string) =>
    GalleryService.databaseListTable(id)

  const tableOnSelect = (id: string, name: string) =>
    GalleryService.databaseGetTableColumns(id, name)

  const tableOnClick = (id: string, tableName: string) =>
    GalleryService.read(id, {tableName})

  const tableOnRename = (id: string, tableName: string, replacement: string) =>
    GalleryService.databaseRenameTable(id, {tableName, replacement})

  const tableOnDelete = (id: string, tableName: string) =>
    GalleryService.databaseDropTable(id, tableName)

  const queryOnSelect = (id: string, value: Record<string, any>) =>
    GalleryService.read(id, value as DataType.Read)

  const sqlOnExecute = (id: string, sql: string) =>
    GalleryService.executeSql(id, sql)

  return (
    <Dataset
      storageOnFetch={fetchStorages}
      storageOnSelect={storageOnSelect}
      tableOnSelect={tableOnSelect}
      tableOnRename={tableOnRename}
      tableOnDelete={tableOnDelete}
      tableOnClick={tableOnClick}
      querySelectorOnSubmit={queryOnSelect}
      sqlOnExecute={sqlOnExecute}
      uploadAddress={fileInsertUrl}
      fileOnUpload={fileInsert}
    />
  )
}

