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
  dashboardName: string
  editable: boolean
  templateNames: string[]
  fetchElements: (dashboardName: string, templateName: string) => Promise<DataType.Template>
  fetchElementContent: (id: string, markName?: string) => Promise<DataType.Content>
  updateElementContent: (categoryName: string, content: DataType.Content) => Promise<void>
}

export interface ContainerRef {
  newElement: (name: string, elementType: DataType.ElementType) => void
}

export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
  const ctRef = useRef<ContainerTemplateRef>(null)

  const [selectedPane, setSelectedPane] = useState<string>()
  const [template, setTemplate] = useState<DataType.Template>()

  useEffect(() => {
    if (selectedPane)
      props
        .fetchElements(props.dashboardName, selectedPane)
        .then(res => setTemplate(res))
  }, [selectedPane])

  const tabOnChange = (name: string) => setSelectedPane(name)

  const newElement = (name: string, elementType: DataType.ElementType) => {
    if (ctRef.current) ctRef.current.newElement(name, elementType)
  }

  useImperativeHandle(ref, () => ({ newElement }))

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
                    categoryName={ template.dashboard!.category!.name }
                    editable={ props.editable }
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

