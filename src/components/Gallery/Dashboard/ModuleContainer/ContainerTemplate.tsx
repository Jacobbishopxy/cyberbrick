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

const genDataGrid = (ele: DataType.Element) =>
  ({ x: +ele.x, y: +ele.y, h: +ele.h, w: +ele.w })


export interface ContainerTemplateProps {
  markAvailable?: boolean
  elements: Elements
  elementFetchContentFn: (id: string) => Promise<DataType.Content | undefined>
  elementUpdateContentFn: (content: DataType.Content) => void
}

export interface ContainerTemplateRef {
  startFetchContent: () => void
  newElement: (name: string, elementType: DataType.ElementType) => void
  saveElements: () => DataType.Element[]
}

export const ContainerTemplate =
  forwardRef((props: ContainerTemplateProps, ref: React.Ref<ContainerTemplateRef>) => {
    const editable = useContext(EditableContext)

    const [elements, setElements] = useState<Elements>(props.elements)
    const [startFetch, setStartFetch] = useState<number>(0)

    const elementOnRemove = (id: string) => () => {
      const newElements = removeElementInLayout(id, elements)
      setElements(newElements)
    }

    const onLayoutChange = (layout: Layout[]) =>
      setElements(updateElementInLayout(elements, layout))

    const startFetchContent = () => {
      if (props.markAvailable)
        setStartFetch(startFetch + 1)
    }

    const newElement = (name: string, elementType: DataType.ElementType) => {
      if (elements.map(e => e.name).includes(name)) {
        message.warning("Please rename your element name because of duplicated!")
      } else {
        // todo: default coordination by element type!
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
    }

    const saveElements = () => elements

    useImperativeHandle(ref, () => ({ startFetchContent, newElement, saveElements }))

    const updateContent = (ele: DataType.Element) =>
      (value: DataType.Content) => props.elementUpdateContentFn({
        ...value,
        element: { id: ele.id, name: ele.name } as DataType.Element
      })


    return (
      <ReactGridLayout
        { ...reactGridLayoutDefaultProps }
        onLayoutChange={ onLayoutChange }
        isDraggable={ editable }
        isResizable={ editable }
      >
        {
          elements.map(ele =>
            <div key={ ele.name } data-grid={ genDataGrid(ele) }>
              <ContainerElement
                markAvailable={ props.markAvailable }
                startFetchContent={ startFetch }
                editable={ editable }
                element={ ele }
                fetchContentFn={ props.elementFetchContentFn }
                updateContentFn={ updateContent(ele) }
                onRemove={ elementOnRemove(ele.id!) }
              />
            </div>
          )
        }
      </ReactGridLayout>
    )
  })

ContainerTemplate.defaultProps = {
  markAvailable: false
} as Partial<ContainerTemplateProps>

