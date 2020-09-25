/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import { message } from "antd"
import _ from "lodash"
import RGL, { Layout, WidthProvider } from "react-grid-layout"

import * as DataType from "../../DataType"
import { ContainerElement } from "./ContainerElement"
import { EditableContext } from "../Dashboard"


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


export interface ContainerTemplateProps {
  elements: Elements
  elementFetchContent: (id: string) => Promise<DataType.Content>
  elementUpdateContent: (content: DataType.Content) => Promise<void>
}

export interface ContainerTemplateRef {
  newElement: (elementType: DataType.ElementType) => void
}

export const ContainerTemplate = forwardRef((props: ContainerTemplateProps, ref: React.Ref<ContainerTemplateRef>) => {
  const editable = useContext(EditableContext)

  const [elements, setElements] = useState<Elements>(props.elements)
  const [newElementName, setNewElementName] = useState<string>()

  const elementOnRemove = (id: string) => () => {
    const newElements = removeElementInLayout(id, elements)
    setElements(newElements)
  }

  const onLayoutChange = (layout: Layout[]) =>
    setElements(updateElementInLayout(elements, layout))

  const updateElementName = (name: string) => setNewElementName(name)

  const newElement = (elementType: DataType.ElementType) => {
    if (newElementName) {

      if (elements.map(e => e.name).includes(newElementName)) {
        message.warning("Please rename your element name because of duplicated!")
      } else {
        // todo: default coordination by element type!
        const newEle = {
          name: newElementName,
          type: elementType,
          x: 0,
          y: Infinity,
          h: 4,
          w: 12,
        } as Element
        setElements(newElementInLayout(elements, newEle))
      }
    } else
      message.warning("Please enter your element name first!")
  }

  useImperativeHandle(ref, () => ({ newElement }))

  return (
    <ReactGridLayout
      { ...reactGridLayoutDefaultProps }
      onLayoutChange={ onLayoutChange }
      isDraggable={ editable }
      isResizable={ editable }
    >
      {
        elements.map(ele =>
          <ContainerElement
            editable={ editable }
            element={ ele }
            fetchContent={ props.elementFetchContent }
            updateContent={ props.elementUpdateContent }
            updateElementName={ updateElementName }
            onRemove={ elementOnRemove(ele.id!) }
          />
        )
      }
    </ReactGridLayout>
  )
})

