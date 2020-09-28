/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, { useEffect, useRef, useState } from 'react'

import * as DataType from "../DataType"
import { ModuleController } from "./ModuleController/ModuleController"
import { Container, ContainerRef } from "./ModuleContainer/Container"


export const EditableContext = React.createContext<boolean>(false)


export interface DashboardProps {
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
  const [edit, setEdit] = useState<boolean>(false)
  const [updatedContents, setUpdatedContents] = useState<DataType.Content[]>([])

  useEffect(() => {
    props.fetchDashboardNames().then(res => setDashboardNames(res.map(i => i.name)))
  }, [])

  const markOnSelect = (value: string) => setSelectedMark(value)

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

  const onSaveTemplateAndContents = async () => {
    if (cRef.current) {
      const t = cRef.current.saveTemplate()
      if (t) return props.saveTemplate(t)
    }
    return Promise.reject(new Error("Invalid template!"))
  }

  const fetchElementContent = async (id: string) => {
    const ele = await props.fetchElementContent(id, selectedMark)
    if (ele && ele.contents) return ele.contents[0]
    return undefined
  }

  const updateElementContent = (ctt: DataType.Content) => {
    // todo
  }


  const updateContent = (ctt: DataType.Content) => {
    if (selectedDashboard)
      return props.updateElementContent(selectedDashboard.category!.name, ctt)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onAddModule = (n: string, et: DataType.ElementType) => {
    if (cRef.current) cRef.current.newElement(n, et)
  }

  const onEditTemplate = (e: boolean) => setEdit(e)


  return (
    <EditableContext.Provider value={ edit }>
      <ModuleController
        dashboardNames={ dashboardNames }
        fetchDashboardMarks={ fetchDashboardMarks }
        markOnSelect={ markOnSelect }
        onAddModule={ onAddModule }
        onEditTemplate={ onEditTemplate }
        onSaveTemplate={ onSaveTemplateAndContents }
      />
      {
        selectedDashboard ?
          <Container
            templateNames={ selectedDashboard.templates!.map(t => t.name) }
            fetchElements={ fetchElements }
            fetchElementContent={ fetchElementContent }
            updateElementContent={ updateElementContent }
            ref={ cRef }
          /> :
          <></>
      }
    </EditableContext.Provider>
  )
}

