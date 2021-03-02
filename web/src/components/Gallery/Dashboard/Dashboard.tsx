/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, {useEffect, useMemo, useRef, useState} from "react"
import {message} from "antd"
import {useModel} from "umi"
import _ from "lodash"

import * as DataType from "../GalleryDataType"
import {Controller} from "./DashboardController/Controller"
import {Container, ContainerRef} from "./DashboardContainer/Container"


export const EditableContext = React.createContext<boolean>(false)

const dashboardContentUpdate = (contents: DataType.Content[], template: DataType.Template) => {

  const elementNameIdMap = _.chain(template.elements!).keyBy("name").mapValues("id").value()

  return contents.map(c => {
    if (c.element!.id === undefined) {
      const element = {...c.element!, id: elementNameIdMap[c.element!.name]}
      return {...c, element}
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
  updateElementContent: (categoryName: string, content: DataType.Content) => Promise<void>
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData: (storageId: string, readOption: DataType.Read) => Promise<any>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)

  const [categories, setCategories] = useState<DataType.Category[]>([])
  const [selectedCategory, setSelectedCategoryName] = useState<string>()
  const [selectedDashboard, setSelectedDashboard] = useState<DataType.Dashboard>()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>()
  const [refresh, setRefresh] = useState<number>(0)
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [newestContent, setNewestContent] = useState<DataType.Content>()
  const [updatedContents, setUpdatedContents] = useState<DataType.Content[]>([])
  const {copyParentInfo} = useModel("tempCopy", (t) => ({
    copyParentInfo: t.copyParentInfo
  }))

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
    if (props.selectedOnChange && selectedCategory && selectedDashboard && selectedTemplateId) {
      const pi = [selectedCategory, selectedDashboard.id!, selectedTemplateId]
      props.selectedOnChange(pi)
      copyParentInfo(JSON.stringify(pi))
      console.log("copyParentInfo", pi)
    }
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
        contents.map(c => props.updateElementContent(selectedDashboard.category!.name, c))
      )
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onCopyTemplate = async (originTemplateId: string) => {
    if (selectedDashboard && selectedTemplateId) {
      props.copyTemplate({
        originTemplateId,
        targetTemplateId: selectedTemplateId
      }).then(() => {
        message.success("Copy template succeeded!")
        if (cRef.current) cRef.current.startFetchElements()
      })
    } else
      message.warn("Copy template failed!")
  }

  const onSaveTemplateAndContents = async () => {
    if (cRef.current) {
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
        cRef.current.fetchTemplate()
        setRefresh(refresh + 1)
        return Promise.resolve()
      }
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
    const id = value.data.id
    const option = value.data as DataType.Read
    if (id && option)
      return props.fetchQueryData(id, option)
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
    onAddModule={onAddModule}
    onCopyTemplate={onCopyTemplate}
    onEditTemplate={setEdit}
    onSaveTemplate={onSaveTemplateAndContents}
  />, [canEdit, categories, onSaveTemplateAndContents])

  const genContainer = useMemo(() => selectedDashboard ?
    <Container
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

