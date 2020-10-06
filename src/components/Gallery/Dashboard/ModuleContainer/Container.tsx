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

export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRefs = useRef<ContainerTemplateRef[]>([])

  const templates = props.dashboardInfo.templates!

  const [selectedPane, setSelectedPane] = useState<string | undefined>(templates[0].name)
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()
  const [template, setTemplate] = useState<DataType.Template>()

  useEffect(() => {
    if (selectedPane) {
      props.fetchElements(selectedPane).then(res => setTemplate(res))
      const si = _.findIndex(templates, t => t.name === selectedPane)
      setSelectedIndex(si)
    }
  }, [selectedPane])

  const tabOnChange = (name: string) => setSelectedPane(name)

  const startFetchAllContents = (idx: number) =>
    () => {
      const rf = ctRefs.current[idx]
      if (props.markAvailable && rf) rf.startFetchAllContents()
    }

  const newElement = (idx: number) =>
    (name: string, timeSeries: boolean, elementType: DataType.ElementType) => {
      const rf = ctRefs.current[idx]
      if (rf) rf.newElement(name, timeSeries, elementType)
    }

  const saveTemplate = (idx: number) =>
    () => {
      const rf = ctRefs.current[idx]

      if (rf && template) {
        const e = rf.saveElements()
        return { ...template, elements: e }
      }
      return template
    }

  useImperativeHandle(ref, () => ({
    startFetchAllContents: startFetchAllContents(selectedIndex!),
    newElement: newElement(selectedIndex!),
    saveTemplate: saveTemplate(selectedIndex!)
  }))

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
    <Tabs
      defaultActiveKey={ props.dashboardInfo[0] }
      onChange={ tabOnChange }
    >
      {
        props.dashboardInfo.templates!.map((t, i) =>
          <Tabs.TabPane tab={ t.name } key={ t.name }>
            {
              template ?
                <ContainerTemplate
                  markAvailable={ props.markAvailable }
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

