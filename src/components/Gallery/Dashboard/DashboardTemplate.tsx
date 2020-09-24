/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useImperativeHandle, useState } from 'react'
import _ from "lodash"
import RGL, { Layout, WidthProvider } from "react-grid-layout"

import * as DataType from "../DataType"
import { DashboardElement } from "./DashboardElement"


const ReactGridLayout = WidthProvider(RGL)
const reactGridLayoutDefaultProps = {
  draggableHandle: ".draggableHandler",
  className: "layout",
  cols: 24,
  rowHeight: 100,
  margin: [5, 5] as [number, number],
  containerPadding: [10, 10] as [number, number],
}

type Element = DataType.Element
type Elements = Element[]

const newElementInLayout = (elements: Elements, element: Element): Elements =>
  _.concat(elements, element)

const updateElementInLayout = (elements: Elements, rawLayout: Layout[]): Elements =>
  _.zip(elements, rawLayout).map(zItem => {
    const ele: Element = zItem[0]!
    const rawEle: Layout = zItem[1]!

    return {
      ...ele,
      x: rawEle.x,
      y: rawEle.y,
      h: rawEle.h,
      w: rawEle.w
    }
  })

const removeElementInLayout = (id: string, elements: Elements): Elements =>
  _.reject(elements, ele => (ele.id === id))


export interface DashboardTemplateProps {
  categoryName: string
  markName?: string
  editable: boolean
  elements: Elements
  elementFetchContent: (id: string, markName?: string) => Promise<DataType.Content>
  elementUpdateContent: (categoryName: string, content: DataType.Content) => Promise<void>
  onNewElement: (elementType: DataType.ElementType) => void
}

export interface DashboardTemplateRef {
  newElement: (name: string, elementType: DataType.ElementType) => void
}

export const DashboardTemplate = forwardRef((props: DashboardTemplateProps, ref: React.Ref<DashboardTemplateRef>) => {

  const [elements, setElements] = useState<Elements>(props.elements)

  const elementOnRemove = (id: string) => () => {
    const newElements = removeElementInLayout(id, elements)
    setElements(newElements)
  }

  const onLayoutChange = (layout: Layout[]) =>
    setElements(updateElementInLayout(elements, layout))

  const newElement = (name: string, elementType: DataType.ElementType) => {
    const newEle = {
      name,
      type: elementType,
      x: 0,
      y: Infinity,
      h: 4,
      w: 12,
    } as Element
    setElements(newElementInLayout(elements, newEle))
  }

  useImperativeHandle(ref, () => ({ newElement }))

  return (
    <ReactGridLayout
      { ...reactGridLayoutDefaultProps }
      onLayoutChange={ onLayoutChange }
      isDraggable={ props.editable }
      isResizable={ props.editable }
    >
      {
        elements.map(ele =>
          <DashboardElement
            categoryName={ props.categoryName }
            editable={ props.editable }
            element={ ele }
            fetchContent={ props.elementFetchContent }
            updateContent={ props.elementUpdateContent }
            onRemove={ elementOnRemove(ele.id!) }
          />
        )
      }
    </ReactGridLayout>
  )
})

