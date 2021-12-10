import React, { useState, useEffect, useContext } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { tabItem } from "../data"
import { Button, message } from "antd";
import { useIntl } from "umi";
import { TabController } from "./TabController";
import { COLS_NUM, DEFAULT_ROW_HEIGHT, RGL_CLASSNAME } from "../util";

import * as DataType from "@/components/Gallery/GalleryDataType"

import { Layout } from 'react-grid-layout';
import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

import { NestedAddModuleModal } from "@/components/Gallery/ModulePanel/Collections/NestedModule/EmbededModule/NestedAddModuleModal"

import useDeepCompareEffect, { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'

const ReactGridLayout = WidthProvider(RGL);
interface DynamicHeaderProps {
  editable: boolean
  // items: tabItem[],
  // currIndex: number,
  setItems?: React.Dispatch<React.SetStateAction<tabItem[]>>,
  onAddItem?: () => void,
  // onRemoveItem?: (i: string) => void,
  // onSwitch: (i: string) => void
  // onLayoutChange: (layout: ReactGridLayout.Layout[]) => void
  // onAddModule: (name: string, timeSeries: boolean, moduleType: any) => void
  content?: DataType.Content
  setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  parentInfo: {
    templateInfo: {
      id: string
    }
  }
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
}


/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
const DynamicHeader = (props: DynamicHeaderProps) => {
  const intl = useIntl()
  // const { onRemoveItem, onSwitch, onAddModule } = props
  const [isHover, setIsHover] = useState<number | null>(null)
  // const [tab]
  /*
  the following are helper method to determine which tab item the mouse is hovering over
  */
  // 控制tabItems是否使能
  const [draggable, setDraggable] = useState(true)
  const onMouseEnter = (id: number) => {
    console.log(40, id)
    setIsHover(id)
  }
  const NestedDedicatedProps = useContext(nestedDedicatedContext)
  // 控制modal显隐
  const [modalVisible, setModalVisible] = useState(false)

  const onMouseLeave = () => {
    setIsHover(-1)
  }

  //添加tab事件
  const onAddTabItems = () => {
    console.log(54, props.content)
    let length = NestedDedicatedProps?.elements?.filter((v) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName).length
    if (length && length >= 30) {
      message.error('已超过最大数！')
      return
    }

    console.log(69, props.content)

    setModalVisible(true)





    //currentIndex+1
    // if (NestedDedicatedProps?.setCurrentIndex) {

    //     NestedDedicatedProps?.setCurrentIndex((currentIndex) => currentIndex + 1)
    // }

    // const newElement = {
    //     i: +new Date(),
    //     x: xPos,
    //     y: yPos,
    //     w: 1,
    //     h: 1,
    //     isSubmodule: true,
    //     parentName: NestedDedicatedProps?.elementName,
    //     template: {
    //         id: props.parentInfo.templateInfo.id
    //     },
    // }
    // // 写入tab
    // if (props.setContent) {
    //     props.setContent((content) => {

    //         const newTabItems = [...content?.data?.tabItems, newElement]
    //         console.log(70, newTabItems)
    //         return {
    //             ...content,
    //             data: {
    //                 ...content?.data,
    //                 tabItems: newTabItems
    //             }
    //         } as DataType.Content
    //     })
    // }

    // // 写入elements
    // if (NestedDedicatedProps?.setElements) {

    //     NestedDedicatedProps?.setElements((allElements) => {

    //         return [...allElements, newElement] as DataType.Element[]
    //     })
    // }
  }

  //添加submodule
  const onAddSubModule = (name: string, timeSeries: boolean, elementType: DataType.ElementType, headData: DataType.ElementHeadData | undefined) => {

    let length = NestedDedicatedProps?.elements?.filter((v) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName).length

    let xPos = (length ? length : 0) % COLS_NUM
    let yPos = Math.floor((length ? length : 0) / COLS_NUM)

    console.log(162, headData)
    const newElement = {
      x: xPos,
      y: yPos,
      w: 1,
      h: 1,
      isSubmodule: true,
      parentName: NestedDedicatedProps?.elementName,
      template: {
        id: props.parentInfo.templateInfo.id
      },
      name,
      timeSeries,
      type: elementType,
      headData,
      dateList: timeSeries ? [] : undefined

    }
    if (NestedDedicatedProps?.setCurrentModuleName) {

      NestedDedicatedProps?.setCurrentModuleName(() => name)
    }
    // 修改elements
    if (NestedDedicatedProps?.setElements) {

      NestedDedicatedProps?.setElements((allElements) => {

        return [...allElements, newElement]
      })
    }

  }


  // tab删除事件，应submodule和其的content一起删除。
  function removeTabItem(el: DataType.Element) {

    // const newTabItems = props.content?.data?.tabItems.filter((v, i) => i !== index)
    // // 删除tab
    // if (props.setContent) {
    //     props.setContent((content) => {
    //         console.log(71, ...content?.data?.tabItems, index)

    //         const newContent = {
    //             ...content,
    //             data: {
    //                 ...content?.data,
    //                 tabItems: newTabItems
    //             }
    //         } as DataType.Content
    //         console.log(80, newContent)
    //         return newContent

    //     })
    // }

    // const deleteName = props.content?.data?.tabItems.find((v, i) => i === index).name
    // 删除elements
    if (NestedDedicatedProps?.setElements) {
      NestedDedicatedProps.setElements((allElements) => {
        return allElements.filter((v) => !(v.isSubmodule && v.name === el.name && NestedDedicatedProps.elementName == el.parentName))
        // const noSubmoduleElements = allElements.filter((v, i) => !(v.isSubmodule && v.parentName === NestedDedicatedProps.elementName))
        // return [...noSubmoduleElements, ...newTabItems] as DataType.Element[]
      })
    }
  }

  //submodule布局变化要更新，且elements也要更新。通过useEffect做到这一点
  const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
    console.log(118, props.content?.data?.tabItems, updateElementInLayout(props.content?.data?.tabItems, layout))
    const newTabItems = updateElementInLayout((NestedDedicatedProps?.elements?.filter((v) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName)) || [], layout)
    //修改tab
    if (props.setContent) {
      props.setContent((content) => {
        return {
          ...content,
          data: {
            ...content?.data,
            tabItems: newTabItems
          }
        } as DataType.Content
      })
    }

    // 修改elments:
    if (NestedDedicatedProps?.setElements) {
      // 全部替换的逻辑：属于该nested模块下的全部替换
      // NestedDedicatedProps.setElements((allElements) => {
      //     const noSubmoduleElements = allElements.filter((v, i) => !(v.isSubmodule && v.parentName === NestedDedicatedProps.elementName))
      //     console.log(168, newTabItems, allElements, noSubmoduleElements)
      //     return [...noSubmoduleElements, ...newTabItems] as DataType.Element[]
      // })
      // 根据allElement去newTabItems找寻相对应元素单对单的替换逻辑
      NestedDedicatedProps.setElements((allElements) => {
        const newAllElements = allElements.map((v) => {
          if (v.isSubmodule && v.parentName == NestedDedicatedProps.elementName) {
            const newElement = newTabItems.find((vl) => v.name === vl.name)
            return newElement ? newElement : v
          } else {
            return v
          }
        })
        return newAllElements as DataType.Element[]
      })
    }
  };

  const updateElementInLayout = (elements: DataType.Element[], rawLayout: Layout[], containerWidth?: number) =>
    _.zip(elements, rawLayout).map(zItem => {
      console.log(52, elements)
      const ele: tabItem = zItem[0]!
      const rawEle: Layout = zItem[1]!
      if (!rawEle) return ele
      // let colMinSize = 64 //set defualt to 64 so that defualt font size is 32
      //if there's a containerWidth, calculate the minimal dimension among width and height
      // if (containerWidth) {
      //     let colUnitWidth = (containerWidth - DEFAULT_MARGIN * (COLS_NUM - 1)) / COLS_NUM
      //     colMinSize = min([colUnitWidth * rawEle.w, DEFAULT_ROW_HEIGHT * rawEle.h])!
      // }
      //update the layout properties in element
      return {
        ...ele,
        x: rawEle.x,
        y: rawEle.y,
        h: rawEle.h,
        w: rawEle.w,
        // minDim: colMinSize!
      }
    })



  //tab点击事件:更换当前的currIndex
  function onSwitch(name: string) {
    if (NestedDedicatedProps?.setCurrentModuleName) {

      NestedDedicatedProps?.setCurrentModuleName(() => name)
    }

  }

  //RGL布局
  function genDataGrid(el) {
    return {
      i: el.i + '',
      x: +el.x,
      y: +el.y,
      h: +el.h,
      w: +el.w
    }
  }

  //选中与为选中的样式
  const className = (name: string) => NestedDedicatedProps?.currentModuleName === name ? "tab-content-selected" : "tab-content"

  console.log(145, props.content?.data?.tabItems)


  const [submoduleElement, setSubmoduleElement] = useState(NestedDedicatedProps?.elements?.filter((v, i) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName))

  useDeepCompareEffectNoCheck(() => {
    const t = NestedDedicatedProps?.elements?.filter((v, i) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName).map((v, i) => v)
    setSubmoduleElement(() => t)
    console.log(287, t)
  }, [NestedDedicatedProps?.elements])

  return (
    <div>
      {
        // 【添加模块】
        props.editable
          ? <div className="align-header">
            <Button
              onClick={onAddTabItems}
              block
            >
              {intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module1" })}</Button>
          </div>
          : <></>
      }

      {/* Modal */}
      <NestedAddModuleModal
        onAddSubModule={onAddSubModule}
        visible={modalVisible}
        onQuit={() => setModalVisible(false)}
        setDraggable={setDraggable}
      />

      <ReactGridLayout
        rowHeight={DEFAULT_ROW_HEIGHT}
        cols={COLS_NUM}
        className={RGL_CLASSNAME}
        isDraggable={props.editable && draggable}
        isResizable={props.editable}
        compactType={"horizontal"}
        // onBreakpointChange={onBreakpointChange}
        // {...props}
        // layout={props.content?.data?.tabItems.map((el, i) => { return { i: el.i, x: 5, y: 5, w: 1, h: 1 } }) || []}
        onLayoutChange={onLayoutChange}
        style={{ minWidth: "100%", border: "0" }}
      >
        {
          // 根据该模块下的子模块进行渲染
          submoduleElement
            ?
            submoduleElement.map((el, i: number) => {
              return (<div
                key={el.name ? el.name : el.i}
                data-grid={genDataGrid(el)}
                // id={el.i}
                className={className(el.name)}
                onClick={() => onSwitch(el.name)}
                onMouseEnter={() => onMouseEnter(i)}
                onMouseLeave={onMouseLeave}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                <TabController
                  editable={props.editable}
                  el={el}
                  isHover={(isHover === i) ? true : false}
                  // isSelected={props.currIndex === el.i}
                  removeTabItem={removeTabItem}
                  // setItems={props.setItems}
                  // onAddSubModule={onAddSubModule(i)}
                  addElement={props.addElement}
                  setDraggable={setDraggable}
                  index={i}
                  content={props.content}
                  setContent={props.setContent}
                />
              </div>)
            }
            )
            : <></>


        }
      </ReactGridLayout>
    </div>
  );

}
export default DynamicHeader