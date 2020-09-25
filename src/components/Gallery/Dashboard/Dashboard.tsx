/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, { useEffect, useRef, useState } from 'react'

import * as DataType from "../DataType"
import { ModuleController } from "./ModuleController/ModuleController"
import { Container, ContainerRef } from "./ModuleContainer/Container"


export const EditableContext = React.createContext<boolean>(false)


export interface DashboardProps {
  fetchDashboardNames: () => Promise<string[]>
  fetchDashboard: (dashboardName: string) => Promise<DataType.Dashboard>
  fetchTemplate: (dashboardName: string, templateName: string) => Promise<DataType.Template>
  saveTemplate: (template: DataType.Template) => Promise<void>
  fetchElementContent: (id: string, markName?: string) => Promise<DataType.Content>
  updateElementContent: (categoryName: string, content: DataType.Content) => Promise<void>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)

  const [dashboardNames, setDashboardNames] = useState<string[]>([])
  const [selectedDashboard, setSelectedDashboard] = useState<DataType.Dashboard>()
  const [selectedMark, setSelectedMark] = useState<string>()
  const [edit, setEdit] = useState<boolean>(false)

  useEffect(() => {
    props.fetchDashboardNames().then(res => setDashboardNames(res))
  }, [])

  const markOnSelect = (value: string) => setSelectedMark(value)

  const fetchDashboardMarks = async (value: string) => {
    const dsb = await props.fetchDashboard(value)
    setSelectedDashboard(dsb)
    return dsb.category?.marks!
  }

  const fetchElements = async (value: string) => {
    if (selectedDashboard)
      return props.fetchTemplate(selectedDashboard.name, value)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onSaveTemplate = async () => {
    if (cRef.current) {
      const t = cRef.current.saveTemplate()
      if (t)
        return props.saveTemplate(t)
    }
    return Promise.reject(new Error("Invalid template!"))
  }

  const fetchElementContent = async (id: string) =>
    props.fetchElementContent(id, selectedMark)

  const updateElementContent = async (ctt: DataType.Content) => {
    if (selectedDashboard)
      return props.updateElementContent(selectedDashboard.category!.name, ctt)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onAddModule = (et: DataType.ElementType) => {
    if (cRef.current) cRef.current.newElement(et)
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
        onSaveTemplate={ onSaveTemplate }
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

