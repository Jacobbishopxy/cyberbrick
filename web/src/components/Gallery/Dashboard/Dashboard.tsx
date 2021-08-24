/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { message } from "antd"
import _ from "lodash"

import * as DataType from "../GalleryDataType"
import { Controller } from "./DashboardController/Controller"
import { Container, ContainerRef } from "./DashboardContainer/Container"
import { useIntl } from "umi"
import { IsTemplateContext } from "@/pages/gallery/DashboardTemplate"


export const EditableContext = React.createContext<boolean>(false)

const dashboardContentUpdate = (contents: DataType.Content[], template: DataType.Template) => {

  const elementNameIdMap = _.chain(template.elements!).keyBy("name").mapValues("id").value()
  const elementNameTypeMap = _.chain(template.elements!).keyBy("name").mapValues("type").value()

  return contents.map(c => {
    if (c.element!.id === undefined || c.element!.type === undefined) {
      const element = { ...c.element!, id: elementNameIdMap[c.element!.name], type: elementNameTypeMap[c.element!.name] }
      return { ...c, element }
    }
    return c
  })
}

const dashboardContentsUpdate = (content: DataType.Content, contents: DataType.Content[]) => {
  const targetContent = _.find(contents, i => i.element?.name === content.element?.name)

  let newContents
  if (targetContent)
    newContents = contents.map(i => i.element?.name === content.element?.name ? content : i)
  else
    newContents = [...contents, content]

  return newContents
}

export interface DashboardProps {
  initialSelected?: string[]
  selectedOnChange?: (v: string[]) => void
  fetchCategoriesByType: () => Promise<DataType.Category[]>
  fetchCategories: () => Promise<DataType.Category[]>
  fetchCategory: (categoryName: string) => Promise<DataType.Category>
  fetchDashboard: (dashboardId: string) => Promise<DataType.Dashboard>
  fetchTemplate: (templateId: string) => Promise<DataType.Template>
  saveTemplate: (template: DataType.Template) => Promise<void>
  copyTemplate: (copy: DataType.CopyTemplateElements) => Promise<void>
  fetchElementContent: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchElementContentDates: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContent: (categoryName: string, type: string, content: DataType.Content) => Promise<void>
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData: (storageId: string, readOption: DataType.Read, databaseType: DataType.StorageType) => Promise<any>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)
  const [categoies, setCategories] = useState<DataType.Category[]>([])
  const [dashboardCategories, setDbCategories] = useState<DataType.Category[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>()
  const [selectedDashboard, setSelectedDashboard] = useState<DataType.Dashboard>()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>()
  const [refresh, setRefresh] = useState<number>(0)
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [newestContent, setNewestContent] = useState<DataType.Content>()
  const [updatedContents, setUpdatedContents] = useState<DataType.Content[]>([])

  const [selected, setSelected] = useState<string[]>()

  const intl = useIntl()

  //this is for selecting categories' dashboard. We only need category of corresponding type
  const isTemplate = useContext(IsTemplateContext)
  const dashboardCategoryType = isTemplate ? DataType.CategoryTypeEnum.temp_lib : DataType.CategoryTypeEnum.dashboard

  // const dashboardCategories = categories.filter(ct => ct.type === dashboardCategoryType)

  useEffect(() => {
    props.fetchCategories().then(res => {
      setCategories(res)
      setDbCategories(res.filter(ct => ct?.type === dashboardCategoryType))
    })

  }, [])


  useEffect(() => {
    if (selectedDashboard && cRef.current) cRef.current.startFetchAllContents()
  }, [selectedDashboard])

  useEffect(() => {
    if (newestContent) {
      const newContents = dashboardContentsUpdate(newestContent, updatedContents)
      setUpdatedContents(newContents)
    }
  }, [newestContent])

  useEffect(() => {
    if (props.selectedOnChange && selected && selectedTemplateId)
      props.selectedOnChange([...selected, selectedTemplateId])
  }, [selectedTemplateId])

  const categoryOnSelect = async (name: string, isCopy: boolean = false) => {
    if (!isCopy) {
      setSelectedCategoryName(name)
      setCanEdit(false)
    }
    return props.fetchCategory(name)
  }

  const dashboardOnSelect = async (dashboardId: string, isCopy: boolean = false) => {
    const dsb = await props.fetchDashboard(dashboardId)
    if (!isCopy) {
      setSelectedDashboard(dsb)
      setCanEdit(true)
      setRefresh(refresh + 1)
    }
    return dsb
  }

  const fetchElements = async (templateId: string) => {
    if (selectedDashboard)
      return props.fetchTemplate(templateId)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const updateAllContents = async (contents: DataType.Content[]) => {
    if (selectedDashboard)
      return Promise.all(
        contents.map(c => props.updateElementContent(selectedDashboard.category!.name, c.element!.type, c))
      )
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onCopyTemplate = async (originTemplateId: string) => {
    if (selectedDashboard && selectedTemplateId) {
      props.copyTemplate({
        originTemplateId,
        targetTemplateId: selectedTemplateId
      }).then(() => {
        message.success(intl.formatMessage({ id: "gallery.dashboard.copy-template1" }))
        if (cRef.current) cRef.current.startFetchElements()
      })
    } else
      message.warn(intl.formatMessage({ id: "gallery.dashboard.copy-template2" }))
  }

  const onRefresh = async (shouldSaveTemplateAndContents: boolean) => {
    if (cRef.current) {
      if (shouldSaveTemplateAndContents) {
        const t = cRef.current.saveTemplate()
        if (t) {
          await props.saveTemplate(t)
          if (updatedContents.length > 0) {
            const updatedTemplate = await props.fetchTemplate(t.id!)
            const contents = dashboardContentUpdate(updatedContents, updatedTemplate)
            await updateAllContents(contents)
            setNewestContent(undefined)
            setUpdatedContents([])
          }
        }

      }
      cRef.current.fetchTemplate()
      setRefresh(refresh + 1)
      return Promise.resolve()
    }
    return Promise.reject(new Error("Invalid template!"))
  }

  const fetchElementContent = async (id: string, date?: string, isNested?: boolean) => {
    /**if the element is nested inside NestedSimpleModule, it doesn't belong to an element. Rather, it's part
     * of the tabItem. So we only fetch the content from database
    */
    if (isNested) return fetchNestedElementContent(id, date)
    const content = await props.fetchElementContent(id, date, isNested)
    return content
  }

  const fetchNestedElementContent = async (id: string, date?: string) => {
    const content = await props.fetchElementContent(id, date, true)
    return content as unknown as DataType.Content
  }

  const fetchElementContentDates = async (id: string) =>
    props.fetchElementContentDates(id)

  const fetchQueryData = async (value: DataType.Content) => {
    // if (!value?.data) return Promise.resolve(undefined)
    const id = value.data?.id
    const option = value.data as DataType.Read
    //default to pg
    const dbType = value.storageType ? value.storageType : DataType.StorageType.PG
    if (id && option)
      return props.fetchQueryData(id, option, dbType)
    return Promise.reject(new Error("content data is inappropriate!"))
  }

  const onAddModule = (n: string, ts: boolean, et: DataType.ElementType) => {
    if (cRef.current) cRef.current.newElement(n, ts, et)
  }

  const genController = useMemo(() => <Controller
    initialSelected={props.initialSelected}
    canEdit={canEdit}
    categoriesAllType={categoies}
    dashboardCategories={dashboardCategories}
    categoryOnSelect={categoryOnSelect}
    dashboardOnSelect={dashboardOnSelect}
    onSelectChange={setSelected}
    onAddModule={onAddModule}
    onCopyTemplate={onCopyTemplate}
    onEditTemplate={setEdit}
    onSaveTemplate={onRefresh}
  />, [canEdit, dashboardCategories, onRefresh])

  const genContainer = useMemo(() => selectedDashboard ?
    <Container
      selectedCategoryName={selectedCategoryName!}
      dashboardInfo={selectedDashboard}
      initialSelected={props.initialSelected}
      onSelectPane={setSelectedTemplateId}
      fetchElements={fetchElements}
      fetchElementContentFn={fetchElementContent}
      fetchElementContentDatesFn={fetchElementContentDates}
      updateElementContentFn={setNewestContent}
      fetchStoragesFn={props.fetchStorages}
      fetchTableListFn={props.fetchTableList}
      fetchTableColumnsFn={props.fetchTableColumns}
      fetchQueryDataFn={fetchQueryData}
      ref={cRef}
    /> : <>{intl.formatMessage({ id: "gallery.component.dashboard-container1" })}</>, [refresh])

  return (
    <EditableContext.Provider value={edit}>
      {genController}
      {genContainer}
    </EditableContext.Provider>
  )
}

