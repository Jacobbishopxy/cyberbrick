/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, {useEffect, useMemo, useRef, useState} from 'react'
import {message} from "antd"
import _ from "lodash"

import * as DataType from "../GalleryDataType"
import {Controller} from "./DashboardController/Controller"
import {Container, ContainerRef} from "./DashboardContainer/Container"


export const EditableContext = React.createContext<boolean>(false)

const dashboardContentUpdate = (contents: DataType.Content[], template: DataType.Template) => {

  const elementNameIdMap = _.chain(template.elements!).keyBy("name").mapValues("id").value()

  return contents.map(c => {
    if (c.element!.id === undefined) {
      return {
        ...c,
        element: {
          ...c.element!,
          id: elementNameIdMap[c.element!.name]
        }
      }
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
  markAvailable?: boolean
  fetchDashboards: () => Promise<GalleryAPI.Dashboard[]>
  fetchDashboard: (dashboardName: string) => Promise<DataType.Dashboard>
  fetchTemplate: (dashboardName: string, templateName: string) => Promise<DataType.Template>
  saveTemplate: (template: DataType.Template) => Promise<void>
  copyTemplate: (copy: DataType.CopyTemplateElements) => Promise<void>
  fetchElementContent: (id: string, date?: string, markName?: string) => Promise<DataType.Element>
  fetchElementContentDates: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContent: (categoryName: string, content: DataType.Content) => Promise<void>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)

  const [dashboards, setDashboards] = useState<GalleryAPI.Dashboard[]>([])
  const [selectedDashboard, setSelectedDashboard] = useState<DataType.Dashboard>()
  const [selectedTemplate, setSelectedTemplate] = useState<string>()
  const [selectedMark, setSelectedMark] = useState<string>()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [newestContent, setNewestContent] = useState<DataType.Content>()
  const [updatedContents, setUpdatedContents] = useState<DataType.Content[]>([])

  useEffect(() => {
    props.fetchDashboards().then(res => setDashboards(res))
  }, [])

  useEffect(() => {
    if (selectedMark && cRef.current) cRef.current.startFetchAllContents()
  }, [selectedMark])

  useEffect(() => {
    if (newestContent) {
      const newContents = dashboardContentsUpdate(newestContent, updatedContents)
      setUpdatedContents(newContents)
    }
  }, [newestContent])

  const dashboardOnSelect = async (dashboardName: string) => {
    const dsb = await props.fetchDashboard(dashboardName)
    setSelectedDashboard(dsb)
    if (!props.markAvailable) {
      setCanEdit(true)
      return undefined
    }
    return dsb.category?.marks
  }
  const markOnSelect = (value: string) => {
    if (props.markAvailable) setCanEdit(true)
    setSelectedMark(value)
  }

  const fetchElements = async (value: string) => {
    if (selectedDashboard)
      return props.fetchTemplate(selectedDashboard.name, value)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const updateAllContents = async (contents: DataType.Content[]) => {
    if (selectedDashboard)
      return Promise.all(
        contents.map(c => props.updateElementContent(selectedDashboard.category!.name, c))
      )
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onCopyTemplate = async (originDashboardName: string, originTemplateName: string) => {
    if (selectedDashboard && selectedTemplate) {
      const targetDashboardName = selectedDashboard.name
      const targetTemplateName = selectedTemplate
      props.copyTemplate({
        originDashboardName,
        originTemplateName,
        targetDashboardName,
        targetTemplateName
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
          const updatedTemplate = await props.fetchTemplate(selectedDashboard!.name, t.name)
          const contents = dashboardContentUpdate(updatedContents, updatedTemplate)
          await updateAllContents(contents)
          setNewestContent(undefined)
          setUpdatedContents([])
        }
        return Promise.resolve()
      }
    }
    return Promise.reject(new Error("Invalid template!"))
  }

  const fetchElementContent = async (id: string, date?: string) => {
    const ele = await props.fetchElementContent(id, date, selectedMark)
    if (ele && ele.contents) return ele.contents[0]
    return undefined
  }

  const fetchElementContentDates = async (id: string) =>
    props.fetchElementContentDates(id, selectedMark)

  const updateElementContent = (ctt: DataType.Content) => {
    let markValue = {}
    if (props.markAvailable && selectedMark) {
      const mId = _.find(selectedDashboard!.category!.marks, m => m.name === selectedMark)
      if (mId) markValue = {mark: {id: mId.id}}
    }
    const newContent = {...ctt, ...markValue} as DataType.Content

    setNewestContent(newContent)
  }

  const onAddModule = (n: string, ts: boolean, et: DataType.ElementType) => {
    if (cRef.current) cRef.current.newElement(n, ts, et)
  }

  const genController = useMemo(() => <Controller
    markAvailable={props.markAvailable}
    canEdit={canEdit}
    dashboards={dashboards}
    dashboardOnSelect={dashboardOnSelect}
    markOnSelect={markOnSelect}
    onAddModule={onAddModule}
    onCopyTemplate={onCopyTemplate}
    onEditTemplate={setEdit}
    onSaveTemplate={onSaveTemplateAndContents}
  />, [canEdit, dashboards, onSaveTemplateAndContents])

  const genContainer = useMemo(() => selectedDashboard ?
    <Container
      markAvailable={props.markAvailable}
      selectedMark={selectedMark}
      dashboardInfo={selectedDashboard}
      onSelectPane={setSelectedTemplate}
      fetchElements={fetchElements}
      fetchElementContentFn={fetchElementContent}
      fetchElementContentDatesFn={fetchElementContentDates}
      updateElementContentFn={updateElementContent}
      ref={cRef}
    /> : <></>, [selectedDashboard, selectedMark])

  return (
    <EditableContext.Provider value={edit}>
      {genController}
      {genContainer}
    </EditableContext.Provider>
  )
}

Dashboard.defaultProps = {
  markAvailable: false
} as Partial<DashboardProps>

