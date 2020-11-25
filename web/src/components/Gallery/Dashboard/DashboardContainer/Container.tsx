/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Tabs} from 'antd'
import _ from "lodash"

import * as DataType from "../../GalleryDataType"
import {ContainerTemplate, ContainerTemplateRef} from "./ContainerTemplate"


export interface ContainerProps {
  markAvailable?: boolean
  selectedMark?: string
  dashboardInfo: DataType.Dashboard
  onSelectPane: (templateName: string) => void
  fetchElements: (templateName: string) => Promise<DataType.Template>
  fetchElementContentFn: (id: string, date?: string, markName?: string) => Promise<DataType.Content | undefined>
  fetchElementContentRemoteFn: (value: DataType.Content) => Promise<any>
  fetchElementContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContentFn: (content: DataType.Content) => void
}

export interface ContainerRef {
  startFetchElements: () => void
  startFetchAllContents: () => void
  newElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
  saveTemplate: () => DataType.Template | undefined
}

interface SelectedPane {
  index: number
  name: string
}

const initSelectedPane = (templates: DataType.Template[]) => {
  if (templates && templates.length > 0)
    return {index: 0, name: templates[0].name}
  return undefined
}

/**
 * dashboard's container, containing custom modules
 *
 * container: [...template[]]; template: [...element[]]; element: module
 */
export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRef = useRef<ContainerTemplateRef>(null)

  const templates = props.dashboardInfo.templates!

  const [selectedPane, setSelectedPane] = useState<SelectedPane>()
  const [template, setTemplate] = useState<DataType.Template>()

  useEffect(() => setSelectedPane(initSelectedPane(templates)), [props.dashboardInfo])

  /**
   * fetch template (with elements) when switching dashboard or it's tabs
   */
  useEffect(() => {
    if (selectedPane) {
      props.fetchElements(selectedPane.name).then(res => setTemplate(res))
      props.onSelectPane(selectedPane.name)
    }
  }, [selectedPane])


  const tabOnChange = (name: string) => setSelectedPane({
    name,
    index: _.findIndex(templates, t => t.name === name)
  })

  const startFetchElements = () => {
    if (selectedPane)
      props.fetchElements(selectedPane.name).then(res => setTemplate(res))
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
    saveTemplate
  }))

  /**
   * template's changing triggers `startFetchAllContents`
   */
  useEffect(() => {
    if (ctRef.current && template) {
      if (props.markAvailable && props.selectedMark)
        startFetchAllContents()
      if (!props.markAvailable)
        startFetchAllContents()
    }
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
        markAvailable={props.markAvailable}
        elements={template.elements!}
        elementFetchContentFn={props.fetchElementContentFn}
        elementFetchContentRemoteFn={props.fetchElementContentRemoteFn}
        elementFetchContentDatesFn={props.fetchElementContentDatesFn}
        elementUpdateContentFn={elementUpdateContentFn}
        ref={ctRef}
      />
    return <></>
  }

  return useMemo(() => {
    return (
      <Tabs onChange={tabOnChange} destroyInactiveTabPane>
        {
          props.dashboardInfo.templates!.map(t =>
            <Tabs.TabPane tab={t.name} key={t.name}>
              {genPane(t)}
            </Tabs.TabPane>
          )
        }
      </Tabs>
    )
  }, [props.dashboardInfo, props.selectedMark, template])
})

Container.defaultProps = {
  markAvailable: false
} as Partial<ContainerProps>

