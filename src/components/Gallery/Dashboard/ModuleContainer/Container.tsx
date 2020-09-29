/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Tabs } from 'antd'

import * as DataType from "../../DataType"
import { ContainerTemplate, ContainerTemplateRef } from "./ContainerTemplate"


const tabPaneGenerator = (name: string,
                          activateName: string | undefined,
                          pane: React.ReactElement<typeof ContainerTemplate>) => {
  if (name === activateName) return pane
  return <></>
}

export interface ContainerProps {
  markAvailable?: boolean
  templateNames: string[]
  fetchElements: (templateName: string) => Promise<DataType.Template>
  fetchElementContentFn: (id: string, markName?: string) => Promise<DataType.Content | undefined>
  updateElementContentFn: (content: DataType.Content) => void
}

export interface ContainerRef {
  startFetchContent: () => void
  newElement: (name: string, elementType: DataType.ElementType) => void
  saveTemplate: () => DataType.Template | undefined
}

export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRef = useRef<ContainerTemplateRef>(null)

  const [selectedPane, setSelectedPane] = useState<string | undefined>(props.templateNames[0])
  const [template, setTemplate] = useState<DataType.Template>()

  useEffect(() => {
    if (selectedPane)
      props.fetchElements(selectedPane).then(res => setTemplate(res))
  }, [selectedPane])

  const tabOnChange = (name: string) => setSelectedPane(name)

  const startFetchContent = () => {
    if (props.markAvailable && ctRef.current)
      ctRef.current.startFetchContent()
  }

  const newElement = (name: string, elementType: DataType.ElementType) => {
    if (ctRef.current) ctRef.current.newElement(name, elementType)
  }

  const saveTemplate = () => {
    if (ctRef.current && template) {
      const e = ctRef.current.saveElements()
      return { ...template, elements: e }
    }
    return template
  }

  useImperativeHandle(ref, () => ({ startFetchContent, newElement, saveTemplate }))

  return (
    <Tabs
      defaultActiveKey={ props.templateNames[0] }
      onChange={ tabOnChange }
    >
      {
        props.templateNames.map(p =>
          <Tabs.TabPane tab={ p } key={ p }>
            {
              template ?
                tabPaneGenerator(
                  p,
                  selectedPane,
                  <ContainerTemplate
                    markAvailable={ props.markAvailable }
                    elements={ template.elements! }
                    elementFetchContentFn={ props.fetchElementContentFn }
                    elementUpdateContentFn={ props.updateElementContentFn }
                    ref={ ctRef }
                  />
                ) :
                <></>
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

