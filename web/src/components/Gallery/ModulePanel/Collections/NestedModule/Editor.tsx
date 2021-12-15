import { useEffect, useState, useContext, useRef } from 'react';
import { Skeleton, Tabs } from 'antd';
import _, { min } from 'lodash';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'

// import { DEFAULT_MARGIN, COLS_NUM, DEFAULT_ROW_HEIGHT } from './util';
// import DynamicHeader from './Header/DynamicHeader';
import * as DataType from "../../../GalleryDataType"
import TabBar from './Header/TabBar'
import { ModuleTabPane } from './EmbededModule/CreateModule';
import { LocalStorageHelper } from "@/utils/localStorageHelper"
import { useLocation } from 'react-router-dom'

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

import styles from './style.less'
interface NestedModuleProps {
  //for temp cache
  // currIndex: number,
  // setCurrIndex: React.Dispatch<React.SetStateAction<number>>,
  NSMid: string,
  // items?: tabItem[]
  editable: boolean
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  // styling?: string//how to apply string as stying？
  contentHeight?: number
  // setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
  // setSaveCount: React.Dispatch<React.SetStateAction<number>>

  fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
  fetchTableListFn: (id: string) => Promise<string[]>
  fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>

  fetchQueryDataFn?: (readOption: DataType.Content) => Promise<any>
  fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  content?: DataType.Content
  setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
  // updateContentFn: (content: DataType.Content) => void
  parentInfo: {
    templateInfo: {
      id: string
    }
  }
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
}


/*
helper method for onLayoutChnage; 
@param rawLayout: the modified layout
@param elements: the object that stores the content of this module
*/


export const NestedModuleEditor = (props: NestedModuleProps) => {

  const container = document.getElementById(props.NSMid)

  const NestedDedicatedProps = useContext(nestedDedicatedContext)
  interface findElementParameter {
    elementName?: string,
    parentName?: string,
    isSubmodule?: boolean,
    elements: DataType.Element[] | undefined
  }
  function findElement({ elementName, parentName, isSubmodule, elements }: findElementParameter) {
    if (elementName && parentName && isSubmodule) {
      if (elements && elements.length > 0) {
        {

          return elements.find((v) => isSubmodule && v.parentName == parentName && v.name === elementName)
        }
      }
    }
  }
  const DynamicHeaderRef = useRef<any>();
  const EditorRef = useRef<any>();




  // tabs
  const { TabPane } = Tabs
  const [activeKey, setActiveKey] = useState('')
  console.log(277, props, NestedDedicatedProps)

  const categoryName = NestedDedicatedProps?.parentInfo?.selectedCategoryName
  const companyName = NestedDedicatedProps?.parentInfo?.dashboardInfo.name
  const dimensionalityName = NestedDedicatedProps?.parentInfo?.templateInfo.name
  // 初始化获取localActiveKey
  const ls = new LocalStorageHelper(`gallery.dashboard.${categoryName}.${companyName}.${dimensionalityName}`, { expiry: [1, "week"] })

  const lsKey = 'activeKey'
  const query = new URLSearchParams(useLocation().search)

  useEffect(() => {
    const initialValue = query.get("anchor")
    console.log(30, initialValue)
    if (initialValue) {
      try {
        const pi = JSON.parse(initialValue)
      } catch { }
    } else {
      const i = ls.get(lsKey)
      if (i) setActiveKey(JSON.parse(i.data))
    }
  }, [])

  useEffect(() => {
    ls.add(lsKey, JSON.stringify(activeKey))
  }, [activeKey])




  // 子模块
  const [submoduleElement, setSubmoduleElement] = useState(NestedDedicatedProps?.elements?.filter((v, i) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName))

  // 子模块根据allElement更新
  useDeepCompareEffectNoCheck(() => {
    const t = NestedDedicatedProps?.elements?.filter((v, i) => v.isSubmodule && v.parentName == NestedDedicatedProps.elementName).map((v, i) => v)
    setSubmoduleElement(() => t)
    console.log(287, t)
  }, [NestedDedicatedProps?.elements])


  return (
    <div className={styles.Editor} ref={EditorRef}>
      {/* head */}
      {/* <div className={styles.DynamicHeader} ref={DynamicHeaderRef} style={{
        display: 'none'
      }}>
        <DynamicHeader
          // items={props.items!}
          editable={props.editable}
          // currIndex={currIndex}
          // setItems={setItems}
          // onAddItem={onAddItem}
          // onRemoveItem={onRemoveItem}
          // onLayoutChange={onLayoutChange}
          // onAddModule={onAddModule}
          content={props.content}
          setContent={props.setContent}
          // onSwitch={onSwitch} 
          parentInfo={props.parentInfo!}
          addElement={props.addElement}

          ref={submoduleElementRef}
        />

      </div> */}


      {/* body */}
      <div className={styles.currModule} style={{
        height: (DynamicHeaderRef.current && EditorRef.current ? EditorRef.current.clientHeight - DynamicHeaderRef.current.clientHeight : '') + 'px'
      }}>
        {/* {"on tab: " + currIndex} */}
        {/* {currModule || <Skeleton active />} */}

        <Tabs
          style={{
            height: '100%'
          }}
          activeKey={activeKey}
          animated
          renderTabBar={(p, t) => {

            return (
              <TabBar
                editable={props.editable}
                content={props.content}
                setContent={props.setContent}
                parentInfo={props.parentInfo}
                addElement={props.addElement}
                tabBar={p.panes}
                activeKey={activeKey}
                setActiveKey={setActiveKey}
              ></TabBar>
            )
          }}
        >
          {
            submoduleElement?.map((v, i) => {
              return (
                <TabPane
                  key={v.name}
                  tab={v.name}
                >
                  <ModuleTabPane
                    ele={v}
                    content={props.content}
                    editable={props.editable}
                    // contentHeight={nestedModuleHeight}
                    // setItems={setItems}
                    // onRemoveModule={onRemoveModule}
                    fetchStoragesFn={props.fetchStoragesFn}
                    fetchTableColumnsFn={props.fetchTableColumnsFn}
                    fetchTableListFn={props.fetchTableListFn}
                    fetchQueryDataFn={props.fetchQueryDataFn}
                    fetchContentFn={props.fetchContentFn}
                    fetchContentDatesFn={props.fetchContentDatesFn}
                    shouldEleStartFetch={1 /** template element should fetch content only when it's mounted*/}
                    setNewestContent={props.setNewestContent}

                  //更新content
                  // updateContentFn={props.updateContentFn}
                  />
                </TabPane>
              )
            })
          }
        </Tabs>
      </div>
    </div>
  );
}

