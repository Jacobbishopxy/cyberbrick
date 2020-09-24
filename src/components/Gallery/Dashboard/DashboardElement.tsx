/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'
import moment from "moment"

import * as DataType from "../DataType"
import { ModulePanel } from "./ModulePanel/ModulePanel"

export interface DashboardElementProps {
  categoryName: string
  markName?: string
  editable: boolean
  element: DataType.Element
  fetchContent: (id: string, markName?: string) => Promise<DataType.Content>
  updateContent: (categoryName: string, content: DataType.Content) => Promise<void>
  onRemove: () => void
}

const genDataGrid = (ele: DataType.Element) =>
  ({ x: ele.x, y: ele.y, h: ele.h, w: ele.w })

export const DashboardElement = (props: DashboardElementProps) => {

  const [content, setContent] = useState<DataType.Content>()
  const eleId = props.element.id as string | undefined
  const eleKey = eleId || moment().format()

  useEffect(() => {
    if (eleId)
      props.fetchContent(eleId, props.markName).then(res => {
        setContent(res)
      })
  }, [])

  const updateContent = (ctt: DataType.Content) => {
    return props.updateContent(props.categoryName, ctt)
  }

  return (
    <div key={ eleKey } data-grid={ genDataGrid(props.element) }>
      <ModulePanel
        headName={ props.element.name }
        elementType={ props.element.type }
        content={ content }
        updateContent={ updateContent }
        onRemove={ props.onRemove }
        editable={ props.editable }
      />
    </div>
  )
}

DashboardElement.defaultProps = {
  editable: false
} as Partial<DashboardElementProps>

