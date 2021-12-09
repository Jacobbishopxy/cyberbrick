/**
 * Created by Jacob Xie on 9/28/2020.
 */

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import { Dashboard } from "@/components/Gallery/Dashboard"
import { GalleryDataType } from "@/components/Gallery"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"
import { LocalStorageHelper } from "@/utils/localStorageHelper"
import React from "react"

const CATEGORY_TYPE = "temp_lib"

export const IsTemplateContext = React.createContext<boolean>(false)

const ls = new LocalStorageHelper("gallery.dashboardTemplate", { expiry: [1, "week"] })
const lsKey = "selected"
const useQuery = () => new URLSearchParams(useLocation().search)

export default () => {

  const [initialSelected, setInitialSelected] = useState<string[]>()
  const query = useQuery()

  const initialValue = query.get("anchor")
  useEffect(() => {
    if (initialValue) {
      try {
        const pi = JSON.parse(initialValue)
        setInitialSelected(pi)
      } catch { }
    } else {
      const i = ls.get(lsKey)
      if (i) setInitialSelected(JSON.parse(i.data))
      console.log(30, i, JSON.parse(i.data))
    }
  }, [])

  useEffect(() => {


  }, [initialValue])


  const selectedOnChange = (v?: string[]) => {
    if (v) ls.add(lsKey, JSON.stringify(v))
  }

  const fetchCategories = () =>
    GalleryService.getAllCategories() as Promise<DataType.Category[]>

  const fetchCategoriesByType = () =>
    GalleryService.getAllCategoriesByType(CATEGORY_TYPE) as Promise<DataType.Category[]>

  const fetchCategory = (name: string) =>
    GalleryService.getCategoryDashboardByName(name) as Promise<DataType.Category>

  const fetchDashboard = (id: string) =>
    GalleryService.getDashboardCategoryAndTemplate(id) as Promise<DataType.Dashboard>

  const fetchTemplate = (templateId: string, isSubmodule?: boolean) =>
    GalleryService.getTemplateElements(templateId, isSubmodule) as Promise<DataType.Template>

  const saveTemplate = (template: GalleryDataType.Template) =>
    GalleryService.updateTemplateElements(template as GalleryAPI.Template)

  const copyTemplate = (copy: GalleryDataType.CopyTemplateElements) =>
    GalleryService.copyTemplateElements(copy)

  const fetchElementContent = (id: string, date?: string, isNested?: boolean) =>
    GalleryService.getElementContent(id, date, isNested) as Promise<DataType.Content>

  const fetchElementContentDates = (id: string, markName?: string) =>
    GalleryService.getElementContentDates(id, markName) as Promise<DataType.Element>

  const updateElementContent = (categoryName: string, type: string, content: GalleryDataType.Content) =>
    GalleryService.saveContentInCategory(categoryName, type, content as GalleryAPI.Content)

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (storageId: string, tableName: string) =>
    GalleryService.databaseGetTableColumns(storageId, tableName)

  const fetchQueryData = (storageId: string, readOption: GalleryDataType.Read, databaseType: GalleryAPI.StorageType) =>
    GalleryService.read(storageId, readOption, databaseType)
  const updateElements = (elements: DataType.Element[]) => GalleryService.updateElements(elements as any)

  // 删除contents
  const delectContents = (ids: string[]) => GalleryService.deleteContents(ids)
  return (
    <IsTemplateContext.Provider value={true}>
      <Dashboard
        initialSelected={initialSelected}
        selectedOnChange={selectedOnChange}
        fetchCategories={fetchCategories}
        fetchCategoriesByType={fetchCategoriesByType}
        fetchCategory={fetchCategory}
        fetchDashboard={fetchDashboard}
        fetchTemplate={fetchTemplate}
        saveTemplate={saveTemplate}
        copyTemplate={copyTemplate}
        fetchElementContent={fetchElementContent}
        fetchElementContentDates={fetchElementContentDates}
        updateElementContent={updateElementContent}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        fetchQueryData={fetchQueryData}
        updateElements={updateElements}
        delectContents={delectContents}
      />
    </IsTemplateContext.Provider>
  )
}

