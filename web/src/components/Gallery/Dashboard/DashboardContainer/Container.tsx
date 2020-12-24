/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Tabs} from 'antd'
import _ from "lodash"

import * as DataType from "../../GalleryDataType"
import {ContainerTemplate, ContainerTemplateRef} from "./ContainerTemplate"


export interface ContainerProps {
  dashboardInfo: DataType.Dashboard
  onSelectPane: (templateId: string) => void
  fetchElements: (templateId: string) => Promise<DataType.Template>
  fetchElementContentFn: (id: string, date?: string, markName?: string) => Promise<DataType.Content | undefined>
  fetchElementContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContentFn: (content: DataType.Content) => void
  fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
  fetchTableListFn: (id: string) => Promise<string[]>
  fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
}

export interface ContainerRef {
  startFetchElements: () => void
  startFetchAllContents: () => void
  newElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
  fetchTemplate: () => void
  saveTemplate: () => DataType.Template | undefined
}

interface SelectedPane {
  id: string
  index: number
  name: string
}

const initSelectedPane = (templates: DataType.Template[]) => {
  if (templates && templates.length > 0)
    return {id: templates[0].id!, index: 0, name: templates[0].name}
  return undefined
}

/**
 * dashboard's container, containing custom modules
 *
 * container: [...template[]]; template: [...element[]]; element: module
 */
export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRef = useRef<ContainerTemplateRef>(null)

  const templates = _.orderBy(props.dashboardInfo.templates, ["index"])

  const [selectedPane, setSelectedPane] = useState<SelectedPane>()
  const [template, setTemplate] = useState<DataType.Template>()

  useEffect(() => setSelectedPane(initSelectedPane(templates)), [props.dashboardInfo])

  /**
   * fetch template (with elements) when switching dashboard or it's tabs
   */
  useEffect(() => {
    if (selectedPane) {
      props.fetchElements(selectedPane.id).then(res => setTemplate(res))
      props.onSelectPane(selectedPane.id)
    }
  }, [selectedPane])


  const tabOnChange = (name: string) => setSelectedPane({
    id: _.find(templates, {name})!.id!,
    name,
    index: _.findIndex(templates, t => t.name === name)
  })

  const startFetchElements = () => {
    if (selectedPane)
      props.fetchElements(selectedPane.id).then(res => setTemplate(res))
  }

  const startFetchAllContents = () => {
    if (selectedPane) {
      const rf = ctRef.current
      if (rf) rf.startFetchAllContents()
    }
  }

  const newElement = (name: string, timeSeries: boolean, elementType: DataType.ElementType) => {
    if (selectedPane) {
      const rf = ctRef.current
      if (rf) rf.newElement(name, timeSeries, elementType)
    }
  }

  const fetchTemplate = () => {
    if (selectedPane)
      props.fetchElements(selectedPane.id).then(res => setTemplate(res))
  }

  const saveTemplate = () => {
    if (selectedPane) {
      const rf = ctRef.current

      if (rf && template) {
        const e = rf.saveElements()
        return {...template, elements: e}
      }
    }
    return template
  }

  useImperativeHandle(ref, () => ({
    startFetchElements,
    startFetchAllContents,
    newElement,
    fetchTemplate,
    saveTemplate
  }))

  /**
   * template's changing triggers `startFetchAllContents`
   */
  useEffect(() => {
    if (ctRef.current && template) startFetchAllContents()
  }, [template])

  const elementUpdateContentFn = (ctt: DataType.Content) => {
    const category = {
      name: props.dashboardInfo.category!.name
    } as DataType.Category
    props.updateElementContentFn({...ctt, category})
  }

  const genPane = (t: DataType.Template) => {
    if (ctRef && t.name === selectedPane?.name && template)
      return <ContainerTemplate
        elements={template.elements!}
        elementFetchContentFn={props.fetchElementContentFn}
        elementFetchContentDatesFn={props.fetchElementContentDatesFn}
        elementUpdateContentFn={elementUpdateContentFn}
        elementFetchStoragesFn={props.fetchStoragesFn}
        elementFetchTableListFn={props.fetchTableListFn}
        elementFetchTableColumnsFn={props.fetchTableColumnsFn}
        elementFetchQueryDataFn={props.fetchQueryDataFn}
        ref={ctRef}
      />
    return <></>
  }

  return useMemo(
    () => (
      <Tabs onChange={tabOnChange} destroyInactiveTabPane>
        {
          templates.map(t =>
            <Tabs.TabPane tab={t.name} key={t.name}>
              {genPane(t)}
            </Tabs.TabPane>
          )
        }
      </Tabs>)
    , [props.dashboardInfo, template])
})

Container.defaultProps = {} as Partial<ContainerProps>

