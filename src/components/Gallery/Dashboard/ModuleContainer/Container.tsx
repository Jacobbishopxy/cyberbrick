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
  templateNames: string[]
  fetchElements: (templateName: string) => Promise<DataType.Template>
  fetchElementContent: (id: string, markName?: string) => Promise<DataType.Content>
  updateElementContent: (content: DataType.Content) => Promise<void>
}

export interface ContainerRef {
  newElement: (elementType: DataType.ElementType) => void
  saveTemplate: () => DataType.Template | undefined
}

export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRef = useRef<ContainerTemplateRef>(null)

  const [selectedPane, setSelectedPane] = useState<string>()
  const [template, setTemplate] = useState<DataType.Template>()

  useEffect(() => {
    if (selectedPane)
      props
        .fetchElements(selectedPane)
        .then(res => setTemplate(res))
  }, [selectedPane])

  const tabOnChange = (name: string) => setSelectedPane(name)

  const newElement = (elementType: DataType.ElementType) => {
    if (ctRef.current) ctRef.current.newElement(elementType)
  }

  const saveTemplate = () => {
    if (template) return template
    return undefined
  }

  useImperativeHandle(ref, () => ({ newElement, saveTemplate }))

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
                    elements={ template.elements! }
                    elementFetchContent={ props.fetchElementContent }
                    elementUpdateContent={ props.updateElementContent }
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

