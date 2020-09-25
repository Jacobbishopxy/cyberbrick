/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'
import moment from "moment"

import * as DataType from "../../DataType"
import { ModulePanel } from "../ModulePanel/ModulePanel"

export interface ContainerElementProps {
  editable: boolean
  element: DataType.Element
  fetchContent: (id: string) => Promise<DataType.Content>
  updateContent: (content: DataType.Content) => Promise<void>
  updateElementName: (n: string) => void
  onRemove: () => void
}

const genDataGrid = (ele: DataType.Element) =>
  ({ x: ele.x, y: ele.y, h: ele.h, w: ele.w })

export const ContainerElement = (props: ContainerElementProps) => {

  const [content, setContent] = useState<DataType.Content>()
  const eleId = props.element.id as string | undefined
  const eleKey = eleId || moment().format()

  useEffect(() => {
    if (eleId)
      props.fetchContent(eleId).then(res => {
        setContent(res)
      })
  }, [])

  const updateContent = (ctt: DataType.Content) => {
    return props.updateContent(ctt)
  }

  return (
    <div key={ eleKey } data-grid={ genDataGrid(props.element) }>
      <ModulePanel
        headName={ props.element.name }
        elementType={ props.element.type }
        content={ content }
        updateContent={ updateContent }
        updateElementName={ props.updateElementName }
        onRemove={ props.onRemove }
        editable={ props.editable }
      />
    </div>
  )
}

ContainerElement.defaultProps = {
  editable: false
} as Partial<ContainerElementProps>

