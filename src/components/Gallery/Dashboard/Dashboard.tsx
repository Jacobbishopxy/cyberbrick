/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, { useEffect, useRef, useState } from 'react'
import _ from "lodash"

import * as DataType from "../DataType"
import { ModuleController } from "./ModuleController/ModuleController"
import { Container, ContainerRef } from "./ModuleContainer/Container"


export const EditableContext = React.createContext<boolean>(false)

const dashboardContentUpdate = (content: DataType.Content, contents: DataType.Content[]) => {
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
  fetchDashboardNames: () => Promise<DataType.Dashboard[]>
  fetchDashboard: (dashboardName: string) => Promise<DataType.Dashboard>
  fetchTemplate: (dashboardName: string, templateName: string) => Promise<DataType.Template>
  saveTemplate: (template: DataType.Template) => Promise<void>
  fetchElementContent: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContent: (categoryName: string, content: DataType.Content) => Promise<void>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)

  const [dashboardNames, setDashboardNames] = useState<string[]>([])
  const [selectedDashboard, setSelectedDashboard] = useState<DataType.Dashboard>()
  const [selectedMark, setSelectedMark] = useState<string>()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [updatedContents, setUpdatedContents] = useState<DataType.Content[]>([])

  useEffect(() => {
    props.fetchDashboardNames().then(res => setDashboardNames(res.map(i => i.name)))
  }, [])

  const dashboardOnSelect = () => setCanEdit(true)
  const markOnSelect = (value: string) => {
    setSelectedMark(value)
    if (props.markAvailable && cRef.current)
      cRef.current.startFetchContent()
  }

  const fetchDashboardMarks = async (value: string) => {
    const dsb = await props.fetchDashboard(value)
    await setSelectedDashboard(dsb)
    return dsb.category?.marks!
  }

  const fetchElements = async (value: string) => {
    if (selectedDashboard)
      return props.fetchTemplate(selectedDashboard.name, value)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const updateAllContents = async () => {
    if (selectedDashboard && updatedContents.length > 0)
      return Promise.all(
        updatedContents
          .map(c => props.updateElementContent(selectedDashboard.category!.name, c))
      )
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onSaveTemplateAndContents = async () => {
    if (cRef.current) {
      const t = cRef.current.saveTemplate()
      if (t) {
        if (updatedContents.length > 0) {
          await updateAllContents()
          setUpdatedContents([])
        }
        await props.saveTemplate(t)
        return Promise.resolve()
      }
    }
    return Promise.reject(new Error("Invalid template!"))
  }

  const fetchElementContent = async (id: string) => {
    const ele = await props.fetchElementContent(id, selectedMark)
    if (ele && ele.contents) return ele.contents[0]
    return undefined
  }

  const updateElementContent = (ctt: DataType.Content) => {
    const newContents = dashboardContentUpdate(ctt, updatedContents)
    setUpdatedContents(newContents)
  }

  const onAddModule = (n: string, et: DataType.ElementType) => {
    if (cRef.current) cRef.current.newElement(n, et)
  }

  return (
    <EditableContext.Provider value={ edit }>
      <ModuleController
        markAvailable={ props.markAvailable }
        canEdit={ canEdit }
        dashboardNames={ dashboardNames }
        dashboardOnSelect={ dashboardOnSelect }
        fetchDashboardMarks={ fetchDashboardMarks }
        markOnSelect={ markOnSelect }
        onAddModule={ onAddModule }
        onEditTemplate={ setEdit }
        onSaveTemplate={ onSaveTemplateAndContents }
      />
      {
        selectedDashboard ?
          <Container
            markAvailable={ props.markAvailable }
            dashboardInfo={ selectedDashboard }
            fetchElements={ fetchElements }
            fetchElementContentFn={ fetchElementContent }
            updateElementContentFn={ updateElementContent }
            ref={ cRef }
          /> :
          <></>
      }
    </EditableContext.Provider>
  )
}

Dashboard.defaultProps = {
  markAvailable: false
} as Partial<DashboardProps>

