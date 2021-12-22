/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { message } from "antd"
import _ from "lodash"
import RGL, { Layout, WidthProvider } from "react-grid-layout"
// import GridLayout, { Layout, WidthProvider } from "react-grid-layout"

import * as DataType from "../../GalleryDataType"
import { TemplateElement, ContainerElementRef } from "./TemplateElement"
import { useIntl } from "umi"
import { template } from "@umijs/deps/compiled/lodash"


import { DashboardContext } from "../DashboardContext"
import { ElementType } from "../../GalleryDataType"
//样式
import "./style.less"
import { RcFile } from "antd/lib/upload"

const ReactGridLayout = WidthProvider(RGL)
// const ReactGridLayout = GridLayout
const reactGridLayoutDefaultProps = {
  draggableHandle: ".draggableHandler",
  className: "layout",
  cols: 24,
  rowHeight: 20,
  margin: [7, 7] as [number, number],
  containerPadding: [10, 10] as [number, number],
  //prevent auto-position when an element is deleted
  // compactType: null
}

type Element = DataType.Element
type Elements = Element[]

const newElementInLayout = (elements: Elements, element: Element): Elements => {
  console.log(41, elements, element)
  return _.concat(elements, element)
}


const updateElementInLayout = (elements: Elements, rawLayout: Layout[]): Elements => {
  console.log(40, elements, rawLayout)
  const zip = _.zip(elements, rawLayout)
  return zip.map(zItem => {
    const ele: Element = zItem[0]!
    const rawEle: Layout = zItem[1]!
    console.log(40, elements, rawLayout, ele, rawEle, zip)
    return {
      ...ele,
      x: rawEle.x,
      y: rawEle.y,
      h: rawEle.h,
      w: rawEle.w
    }
  })
}


const removeElementInLayout = (name: string, elements: Elements): Elements =>
  _.reject(elements, ele => (ele.name === name))

// const genDataGrid = (ele: DataType.Element) => {
//     console.log(57, ele)
//     if (ele.type === ElementType.TargetPrice) {

//         return ({
//             x: +ele.x,
//             y: +ele.y,
//             h: 10,
//             w: +ele.w
//         })
//     }
// }



export interface ContainerTemplateProps {
  parentInfo: {
    selectedCategoryName: string,
    dashboardInfo: DataType.Dashboard
    templateInfo: DataType.Template
  }
  elements: Elements
  setElements: React.Dispatch<React.SetStateAction<DataType.Element[]>>
  shouldEleFetch: number
  // elementFetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  elementFetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  setNewestContent: (content: DataType.Content) => void
  elementFetchStoragesFn: () => Promise<DataType.StorageSimple[]>
  elementFetchTableListFn: (id: string) => Promise<string[]>
  elementFetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
  elementFetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
}

export interface ContainerTemplateRef {
  newElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
  getElements: () => DataType.Element[]
}

/**
 * container's template
 */
export const ContainerTemplate =
  forwardRef((props: ContainerTemplateProps, ref: React.Ref<ContainerTemplateRef>) => {

    const dashboardContextProps = useContext(DashboardContext)
    const teRefs = useRef<ContainerElementRef[]>([])
    // const editable = useContext(DashboardContext)
    // const [editable, setEditable] = useState(dashboardContextProps.e)
    const intl = useIntl()
    // const [elements, setElements] = useState<Elements>(props.elements)

    console.log(101, props)

    const [noSubmoduleElements, setNoSubmoduleElements] = useState<DataType.Element[]>([])
    // update elements when adding a new element
    //在添加新元素时更新元素
    // useEffect(
    //     () => {
    //         console.log(94, props.elements)
    //         setElements(props.elements)
    //     },
    //     [props.elements])

    //按照模块名字删除， elments里的content要一并删除，已在监听element做处理
    const elementOnRemove = (el: DataType.Element) => () => {
      // const newElements = removeElementInLayout(name, elements)

      //如果要删除的模块是nested模块，submodule要一起删除。

      let deleteElementsName: string[] = []
      if (el.type === ElementType.NestedModule) {
        deleteElementsName.push(...props.elements.filter((el) => el.isSubmodule && el.parentName === el.parentName).map((el) => el.name))

      }
      //加入要被删除nestedName
      deleteElementsName.push(el.name)
      console.log(140, deleteElementsName)
      props.setElements((elements) => {

        const newElements = _.reject(elements, (e) => deleteElementsName.includes(e.name))
        console.log(123, deleteElementsName, elements, newElements)
        return newElements
      })
      //testing: manually remove ref from teRefs
      // teRefs.current.splice(index, 1)
    }



    //新建element
    const newElement = (name: string, timeSeries: boolean, elementType: DataType.ElementType, isNested?: boolean) => {
      console.log(136)
      let height = 0;
      let width = 0;
      switch (elementType) {
        case DataType.ElementType.FieldHeader:
          height = 8;
          width = 24
          break;
        case DataType.ElementType.XlsxTable || DataType.ElementType.FlexTable:
          height = 20
          width = 24
          break
        case DataType.ElementType.TargetPrice:
          height = 11
          width = 12
          break
        case DataType.ElementType.NestedModule:
          height = 18
          width = 24
          break
        case DataType.ElementType.ConsensusDistribution:
          height = 11
          width = 12
          break
        case DataType.ElementType.Text:
          height = 20
          width = 24
          break
        case DataType.ElementType.FileManager:
          height = 20
          width = 24
          break
        default:
          height = 20;
          width = 12;
          break;
      }
      console.log(156, props.elements, elementType, name, height, width)
      if (props.elements.map(e => e.name).includes(name)) {
        message.warning(intl.formatMessage({ id: "gallery.component.add-module-modal8" }))
        return false
      } else {
        const newEle = {
          name,
          type: elementType,
          timeSeries,
          x: 0,
          y: Infinity,
          h: height,
          w: width,
          isSubmodule: isNested ? true : false,
          parentName: undefined
          // dateList: timeSeries ? [] : undefined
        } as Element
        props.setElements(newElementInLayout(props.elements, newEle))
        return true
      }
    }

    const getElements = () => props.elements

    useImperativeHandle(ref, () => ({ newElement, getElements }))


    const setNewestContent = (ele: DataType.Element) => {
      return (value: DataType.Content, submoduleElement: DataType.Element) => {
        console.log(219, ele)
        if (submoduleElement) {
          return props.setNewestContent({
            ...value,
            templateInfo: props.parentInfo.templateInfo,
            element: submoduleElement as DataType.Element
          })
        } else {
          return props.setNewestContent({
            ...value,
            templateInfo: props.parentInfo.templateInfo,
            element: ele as DataType.Element
          })
        }

      }
    }


    const updateDescription = (ele: DataType.Element) =>
      (value: string) => props.setElements(els => els.map(el => {
        if (el.id === ele.id) return { ...el, description: value }
        return el
      }))


    const genRef = (i: number) => (el: ContainerElementRef) => {
      if (el) teRefs.current[i] = el
    }
    const genDataGrid = (ele: DataType.Element) => {
      // let h = 0;
      // let w = 0;
      // switch (ele.type) {
      //     case ElementType.TargetPrice:
      //         h = 9;
      //         w = +ele.w;
      //         break;
      //     case ElementType.XlsxTable:
      //         h = 20;
      //         w = 20;
      //         break;
      //     default:
      //         h = +ele.h
      //         w = +ele.w
      //         break;
      // }
      console.log(236, ele)
      return {
        x: +ele.x,
        y: +ele.y,
        h: +ele.h,
        w: +ele.w,
        i: ele.name,
        // minH: ele.type === DataType.ElementType.FieldHeader ? 0 : 10,
        // minW: ele.type === DataType.ElementType.FieldHeader ? 0 : 8
      }
    }

    //elements
    // const [elements, setElements] = useState(props.elements)
    // useEffect(() => {
    //     console.log(222, props.elements)
    //     setElements((el) => props.elements)
    // }, [props.elements])


    // 重新获得布局改变后的elements位置。
    const onLayoutChange = (layout: Layout[]) => {

      props.setElements((allElements) => {
        const noSE = updateElementInLayout(noSubmoduleElements, layout)
        const SE = allElements.filter((e) => e.isSubmodule)
        console.log(258, allElements, noSE, SE)
        return [...noSE, ...SE]
      })
    }

    // 每当elements变化都更新非子模块
    useEffect(() => {
      console.log(222, props.elements)
      setNoSubmoduleElements(() => {
        return props.elements.filter((ele, i) => {
          console.log(250, ele)
          return !ele.isSubmodule

        })
      })
    }, [props.elements])
    return (
      <ReactGridLayout
        {...reactGridLayoutDefaultProps}
        onLayoutChange={onLayoutChange}
        isDraggable={dashboardContextProps?.edit}
        isResizable={dashboardContextProps?.edit}
        autoSize={true}
      >
        {
          // 只渲染非子模块
          // props.elements.map((ele, i) => {
          noSubmoduleElements.map((ele, i) => {
            return (
              <div
                key={ele.id || ele.name}
                data-grid={genDataGrid(ele)}
              >
                {/* <div style={{ height: '100%', paddingBottom: '20px' }}> */}
                <TemplateElement
                  parentInfo={props.parentInfo}
                  timeSeries={ele.timeSeries}
                  editable={dashboardContextProps?.edit}
                  element={ele}
                  // fetchContentFn={props.elementFetchContentFn}
                  fetchContentDatesFn={props.elementFetchContentDatesFn}
                  setNewestContent={setNewestContent(ele)}
                  onRemove={elementOnRemove(ele)}
                  fetchStoragesFn={props.elementFetchStoragesFn}
                  fetchTableListFn={props.elementFetchTableListFn}
                  fetchTableColumnsFn={props.elementFetchTableColumnsFn}
                  fetchQueryDataFn={props.elementFetchQueryDataFn}
                  ref={genRef(i)}

                  shouldStartFetch={props.shouldEleFetch}
                  updateDescription={updateDescription(ele)}
                  addElement={newElement}
                  elements={props.elements}
                  setElements={props.setElements}
                />
                {/* </div> */}
              </div>
            )
          })

        }
      </ReactGridLayout>
    )
  })

ContainerTemplate.defaultProps = {} as Partial<ContainerTemplateProps>

