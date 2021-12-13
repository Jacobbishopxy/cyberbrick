import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { Button, message } from "antd";
import { useIntl } from "umi";
import { Layout } from 'react-grid-layout';

import { tabItem } from "../data"
import { TabController } from "./TabController";
import { COLS_NUM, DEFAULT_ROW_HEIGHT, RGL_CLASSNAME } from "../util";
import * as DataType from "@/components/Gallery/GalleryDataType"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
import { NestedAddModuleModal } from "@/components/Gallery/ModulePanel/Collections/NestedModule/EmbededModule/NestedAddModuleModal"




const ReactGridLayout = WidthProvider(RGL);
interface DynamicHeaderProps {
  editable: boolean
  setItems?: React.Dispatch<React.SetStateAction<tabItem[]>>,
  onAddItem?: () => void,
  content?: DataType.Content
  setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  parentInfo: {
    templateInfo: {
      id: string
    }
  }
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean

  tabBar: any[]
  activeKey: string
  setActiveKey: React.Dispatch<React.SetStateAction<string>>
}


const TabBar = (props: DynamicHeaderProps) => {
  const intl = useIntl()
  const [isHover, setIsHover] = useState<number | null>(null)
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

    const newTabItems = updateElementInLayout((NestedDedicatedProps?.elements?.filter((v) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName)) || [], layout)

    //修改tab
    // if (props.setContent) {
    //   props.setContent((content) => {
    //     return {
    //       ...content,
    //       data: {
    //         ...content?.data,
    //         tabItems: newTabItems
    //       }
    //     } as DataType.Content
    //   })
    // }

    // 修改elments:
    if (NestedDedicatedProps?.setElements) {
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
      const ele = zItem[0]!
      const rawEle: Layout = zItem[1]!
      if (!rawEle) return ele

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
    props.setActiveKey(name)
    if (NestedDedicatedProps?.setCurrentModuleName) {
      NestedDedicatedProps?.setCurrentModuleName(() => name)
    }
  }

  //RGL布局
  function genDataGrid(el) {
    console.log(192, el)
    return {
      i: el.i + '',
      x: +el.x,
      y: +el.y,
      h: +el.h,
      w: +el.w
    }
  }

  //选中与为选中的样式
  const className = (name: string) => props.activeKey === name ? "tab-content-selected" : "tab-content"


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
        setActiveKey={props.setActiveKey}
      />

      <ReactGridLayout
        rowHeight={DEFAULT_ROW_HEIGHT}
        cols={COLS_NUM}
        className={RGL_CLASSNAME}
        isDraggable={props.editable && draggable}
        isResizable={props.editable}
        compactType={"horizontal"}
        onLayoutChange={onLayoutChange}
        style={{ minWidth: "100%", border: "0" }}
      >

        {
          props.tabBar
            ? props.tabBar.map((v, i: number) => {
              const el = v.props.children.props.ele
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
            })
            : <></>
        }
      </ReactGridLayout>
    </div>
  );

}
export default TabBar