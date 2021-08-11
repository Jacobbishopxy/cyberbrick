/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, { useEffect, useMemo, useRef, useState } from "react"
import { message } from "antd"
import _ from "lodash"

import * as DataType from "../GalleryDataType"
import { Controller } from "./DashboardController/Controller"
import { Container, ContainerRef } from "./DashboardContainer/Container"
import { useIntl } from "umi"


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

  fetchCategories: () => Promise<DataType.Category[]>
  fetchCategory: (categoryName: string) => Promise<DataType.Category>
  fetchDashboard: (dashboardId: string) => Promise<DataType.Dashboard>
  fetchTemplate: (templateId: string) => Promise<DataType.Template>
  saveTemplate: (template: DataType.Template) => Promise<void>
  copyTemplate: (copy: DataType.CopyTemplateElements) => Promise<void>
  fetchElementContent: (id: string, date?: string, markName?: string) => Promise<DataType.Element>
  fetchElementContentDates: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContent: (categoryName: string, type: string, content: DataType.Content) => Promise<void>
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData: (storageId: string, readOption: DataType.Read, databaseType: DataType.StorageType) => Promise<any>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)

  const [categories, setCategories] = useState<DataType.Category[]>([])
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

  useEffect(() => {
    props.fetchCategories().then(res => setCategories(res))
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

  const fetchElementContent = async (id: string, date?: string) => {
    const ele = await props.fetchElementContent(id, date)
    if (ele && ele.contents) return ele.contents[0]
    return undefined
  }

  const fetchElementContentDates = async (id: string) =>
    props.fetchElementContentDates(id)

  const fetchQueryData = async (value: DataType.Content) => {
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
    categories={categories}
    categoryOnSelect={categoryOnSelect}
    dashboardOnSelect={dashboardOnSelect}
    onSelectChange={setSelected}
    onAddModule={onAddModule}
    onCopyTemplate={onCopyTemplate}
    onEditTemplate={setEdit}
    onSaveTemplate={onRefresh}
  />, [canEdit, categories, onRefresh])

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
    /> : <></>, [refresh])

  return (
    <EditableContext.Provider value={edit}>
      {genController}
      {genContainer}
    </EditableContext.Provider>
  )
}

