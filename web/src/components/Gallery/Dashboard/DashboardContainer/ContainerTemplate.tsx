/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { message } from "antd"
import _ from "lodash"
import RGL, { Layout, WidthProvider } from "react-grid-layout"

import * as DataType from "../../GalleryDataType"
import { TemplateElement, ContainerElementRef } from "./TemplateElement"
import { EditableContext } from "../Dashboard"
import { useIntl } from "umi"


const ReactGridLayout = WidthProvider(RGL)
const reactGridLayoutDefaultProps = {
  draggableHandle: ".draggableHandler",
  className: "layout",
  cols: 24,
  rowHeight: 20,
  margin: [5, 5] as [number, number],
  containerPadding: [10, 10] as [number, number],
  //prevent auto-position when an element is deleted
  // compactType: null
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

const removeElementInLayout = (name: string, elements: Elements): Elements =>
  _.reject(elements, ele => (ele.name === name))

const genDataGrid = (ele: DataType.Element) =>
  ({ x: +ele.x, y: +ele.y, h: +ele.h, w: +ele.w })


export interface ContainerTemplateProps {
  parentInfo: string[]
  elements: Elements
  shouldEleFetch: number
  elementFetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  elementFetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  elementUpdateContentFn: (content: DataType.Content) => void
  elementFetchStoragesFn: () => Promise<DataType.StorageSimple[]>
  elementFetchTableListFn: (id: string) => Promise<string[]>
  elementFetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
  elementFetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
}

export interface ContainerTemplateRef {
  newElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
  saveElements: () => DataType.Element[]
}

/**
 * container's template
 */
export const ContainerTemplate =
  forwardRef((props: ContainerTemplateProps, ref: React.Ref<ContainerTemplateRef>) => {
    const teRefs = useRef<ContainerElementRef[]>([])
    const editable = useContext(EditableContext)
    const intl = useIntl()

    const [elements, setElements] = useState<Elements>(props.elements)



    // update elements when adding a new element
    useEffect(() => setElements(props.elements), [props.elements])

    //since unsaved elements don't have id, and each element has a unique name, remove element by name
    const elementOnRemove = (name: string) => () => {
      const newElements = removeElementInLayout(name, elements)
      setElements(newElements)
      //testing: manually remove ref from teRefs
      let index = elements.findIndex(ele => ele.name === name)
      teRefs.current.splice(index, 1)
    }

    const onLayoutChange = (layout: Layout[]) =>
      setElements(updateElementInLayout(elements, layout))


    const newElement = (name: string, timeSeries: boolean, elementType: DataType.ElementType) => {
      if (elements.map(e => e.name).includes(name)) {
        message.warning(intl.formatMessage({ id: "gallery.component.add-module-modal8" }))
      } else {
        const newEle = {
          name,
          type: elementType,
          timeSeries,
          x: 0,
          y: Infinity,
          h: 20,
          w: 12,
        } as Element
        setElements(newElementInLayout(elements, newEle))
      }
    }

    const saveElements = () => elements

    useImperativeHandle(ref, () => ({ newElement, saveElements }))

    const updateContent = (ele: DataType.Element) =>
      (value: DataType.Content) => props.elementUpdateContentFn({
        ...value,
        element: { id: ele.id, name: ele.name, type: ele.type } as DataType.Element
      })

    const genRef = (i: number) => (el: ContainerElementRef) => {
      if (el) teRefs.current[i] = el
    }

    /** 1. determine whether the content is "pointer". 
     * 2. If it is, fetch the actual data from 3rd party database by calling fetchQuery. 
     * 3. update the content to make sure we have the actual content stored in React state.
          */
    const fetchQueryAndUpdateContent = (c: DataType.Content, elementType: DataType.ElementType) => {
      let ct: DataType.Content = c
      //if we should and could fetch query, fetch!
      if (DataType.shouldQueryAfterRecevingContent(elementType)
        && DataType.MongoContentValidation(c?.data)) {
        props.elementFetchQueryDataFn(c).then(res => {
          ct = {
            ...ct, data: { ...c?.data, ...res },
            date: ct?.date || DataType.today() //create date if not exist
          }
        })
      }
      return ct
    }

    /**
     * Template Element may be nested in a module, so we have different fetch api
     * If TemplateElment is nested, eleId is actually tabId.
     */
    const fetchContent = (eleId: string, elementType: DataType.ElementType, date?: string) => {
      let ct: DataType.Content | undefined
      //we need element's id to fetch
      if (eleId) {
        //no need to check date since it's allowed date to be undefined
        return props.elementFetchContentFn(eleId, date).then(res =>
          fetchQueryAndUpdateContent(res as DataType.Content, elementType))
      }
      return Promise.resolve(ct)
    }

    return (
      <ReactGridLayout
        {...reactGridLayoutDefaultProps}
        onLayoutChange={onLayoutChange}
        isDraggable={editable}
        isResizable={editable}
        layout={elements.map(ele => { return { x: +ele.x, y: +ele.y, h: +ele.h, w: +ele.w, i: ele.name } })}
      >
        {
          elements.map((ele, i) =>
            <div key={ele.name} data-grid={genDataGrid(ele)}>
              <TemplateElement
                parentInfo={props.parentInfo}
                timeSeries={ele.timeSeries}
                editable={editable}
                element={ele}
                fetchContentFn={props.elementFetchContentFn}
                fetchContentDatesFn={props.elementFetchContentDatesFn}
                updateContentFn={updateContent(ele)}
                onRemove={elementOnRemove(ele.name)}
                fetchStoragesFn={props.elementFetchStoragesFn}
                fetchTableListFn={props.elementFetchTableListFn}
                fetchTableColumnsFn={props.elementFetchTableColumnsFn}
                fetchQueryDataFn={props.elementFetchQueryDataFn}
                ref={genRef(i)}

                shouldStartFetch={props.shouldEleFetch || 1}
                onTEfetchContent={fetchContent}
              />
            </div>
          )
        }
      </ReactGridLayout>
    )
  })

ContainerTemplate.defaultProps = {} as Partial<ContainerTemplateProps>

