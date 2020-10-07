/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Tabs } from 'antd'
import _ from "lodash"

import * as DataType from "../../DataType"
import { ContainerTemplate, ContainerTemplateRef } from "./ContainerTemplate"


export interface ContainerProps {
  markAvailable?: boolean
  selectedMark?: string
  dashboardInfo: DataType.Dashboard
  fetchElements: (templateName: string) => Promise<DataType.Template>
  fetchElementContentFn: (id: string, date?: string, markName?: string) => Promise<DataType.Content | undefined>
  fetchElementContentDatesFn: (id: string) => Promise<DataType.Element>
  updateElementContentFn: (content: DataType.Content) => void
}

export interface ContainerRef {
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
    return { index: 0, name: templates[0].name }
  return undefined
}

export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRefs = useRef<ContainerTemplateRef[]>([])

  const templates = props.dashboardInfo.templates!

  const [selectedPane, setSelectedPane] = useState<SelectedPane | undefined>(initSelectedPane(templates))
  const [template, setTemplate] = useState<DataType.Template>()
  const [startFetchAllTrigger, setStartFetchAllTrigger] = useState<number>(0)

  /**
   * fetch template (with elements) when switching tabs
   */
  useEffect(() => {
    if (selectedPane)
      props.fetchElements(selectedPane.name).then(res => setTemplate(res))
  }, [selectedPane])

  /**
   * template's changing triggers `startFetchAllContents`
   */
  useEffect(() => {
    if (template) {
      if (props.markAvailable && props.selectedMark)
        setStartFetchAllTrigger(startFetchAllTrigger + 1)
      if (!props.markAvailable)
        setStartFetchAllTrigger(startFetchAllTrigger + 1)
    }
  }, [template])

  const tabOnChange = (name: string) => {
    setSelectedPane({ name, index: _.findIndex(templates, t => t.name === name) })
  }

  const startFetchAllContents = () => {
    if (selectedPane) {
      const rf = ctRefs.current[selectedPane.index]
      if (rf) rf.startFetchAllContents()
    }
  }

  const newElement = (name: string, timeSeries: boolean, elementType: DataType.ElementType) => {
    if (selectedPane) {
      const rf = ctRefs.current[selectedPane.index]
      if (rf) rf.newElement(name, timeSeries, elementType)
    }
  }

  const saveTemplate = () => {
    if (selectedPane) {
      const rf = ctRefs.current[selectedPane.index]

      if (rf && template) {
        const e = rf.saveElements()
        return { ...template, elements: e }
      }
    }
    return template
  }

  useImperativeHandle(ref, () => ({ startFetchAllContents, newElement, saveTemplate }))

  const elementUpdateContentFn = (ctt: DataType.Content) => {
    const category = {
      name: props.dashboardInfo.category!.name
    } as DataType.Category
    props.updateElementContentFn({ ...ctt, category })
  }

  const genRef = (i: number) => (el: ContainerTemplateRef) => {
    if (el) ctRefs.current[i] = el
  }

  return (
    <Tabs onChange={ tabOnChange }>
      {
        props.dashboardInfo.templates!.map((t, i) =>
          <Tabs.TabPane tab={ t.name } key={ t.name }>
            {
              template ?
                <ContainerTemplate
                  markAvailable={ props.markAvailable }
                  startFetchAllTrigger={ startFetchAllTrigger }
                  elements={ template.elements! }
                  elementFetchContentFn={ props.fetchElementContentFn }
                  elementFetchContentDatesFn={ props.fetchElementContentDatesFn }
                  elementUpdateContentFn={ elementUpdateContentFn }
                  ref={ genRef(i) }
                /> : <></>
            }
          </Tabs.TabPane>
        )
      }
    </Tabs>
  )
})

Container.defaultProps = {
  markAvailable: false
} as Partial<ContainerProps>

