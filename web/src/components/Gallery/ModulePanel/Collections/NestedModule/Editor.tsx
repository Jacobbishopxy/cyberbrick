import DynamicHeader from './Header/DynamicHeader';
import { useEffect, useState, useContext } from 'react';
import { tabItem } from './data';
import { Skeleton } from 'antd';
import { ModuleTabPane } from './EmbededModule/CreateModule';
import _, { min } from 'lodash';
import { DEFAULT_MARGIN, COLS_NUM, DEFAULT_ROW_HEIGHT } from './util';
import * as DataType from "../../../GalleryDataType"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
import styles from './style.less'
interface NestedModuleProps {
    //for temp cache
    // currIndex: number,
    // setCurrIndex: React.Dispatch<React.SetStateAction<number>>,
    NSMid: string,
    // items?: tabItem[]
    editable: boolean
    // styling?: string//how to apply string as stying？
    contentHeight?: number
    // setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    // setSaveCount: React.Dispatch<React.SetStateAction<number>>

    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>

    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
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
    //used to make sure the generated tab id is unique
    const counterPrefix = DataType.now()
    // const { setSaveCount, currIndex, setCurrIndex } = props

    // const [currIndex, setCurrIndex] = useState(props.currIndex || "0")
    const [newCounter, setNewCounter] = useState(0)
    //determined when to ask parent to update content
    const [updateCnt, setUpdateCnt] = useState(0)

    //tabs layout updated
    // useEffect(() => {
    //     setSaveCount(cnt => cnt + 1)
    // }, [props.items])

    //embeded modulePanal updated
    // useEffect(() => {
    //     setSaveCount(cnt => cnt + 1)
    // }, [updateCnt])

    //update curr index
    // useEffect(() => {
    //     if (props.setCurrIndex) props.setCurrIndex(currIndex)
    // }, [currIndex])



    //remove tabs
    // const onRemoveItem = (i: string) => {
    //     setItems(its => its.filter(el => el.i !== i))
    // }

    //tabs点击事件
    // const onSwitch = (i: string) => {
    //     setCurrIndex(parseInt(i))
    //     setUpdateCnt(updateCnt + 1)
    // }
    const container = document.getElementById(props.NSMid)
    /*
    callback method responsing for resizing, adding, removing, and dragging elements in
    react-grid-layout. This method does 2 things:
    1. calculate current container width
    2. update the items list with new layout and newly calculated 
        minimal dimension of an item (details see updateElementInLayout)
    */
    const NestedDedicatedProps = useContext(nestedDedicatedContext)




    //每当tabItems变化时，同时更新全局的elements
    // 更新逻辑：用tabItems带有name的模块替换elements中的submodule
    // useEffect(() => {

    //     if (NestedDedicatedProps?.setElements) {
    //         NestedDedicatedProps?.setElements((elements) => {
    //             // 之前的更新逻辑
    //             // const names = elements.map(el => el.name)
    //             // let newElements = elements.slice();
    //             // props.content?.data?.tabItems.map((el: DataType.Element, i) => {
    //             //     if (el.name) {
    //             //         const index = names.indexOf(el.name)
    //             //         if (index !== -1) {
    //             //             newElements[index] = el
    //             //         } else {
    //             //             newElements.push(el)
    //             //         }
    //             //     }
    //             // })

    //             // const submodules = props.content?.data?.tabItems.filter((item) => item.name)


    //             const newElements = [...elements.filter((el) => !el.isSubmodule), ...props.content?.data?.tabItems]
    //             console.log(138, elements.filter((el) => !el.isSubmodule), props.content?.data?.tabItems, newElements)
    //             return newElements
    //         })
    //     }

    // }, [props.content?.data?.tabItems])

    //callback to add a new module
    // const onAddModule = (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => {
    //     let content = { date: DataType.today(), data: { content: name } }
    //replace existing module
    // if (props.items!.find(item => item.i === tabId && item.module)) {
    //     //delete old module content
    //     onRemoveModule(tabId)
    // }
    //add the new module to items list
    // setItems(items => items.map((item) => {
    //     //update the json object
    //     if (item.i === tabId) {
    //         return { ...item, module: { name: name, timeSeries: timeSeries, elementType: moduleType, content: content } }
    //     }
    //     console.log(144, item)
    //     return item
    // }))
    //     setUpdateCnt(updateCnt + 1)

    // }

    // const onRemoveModule = (id: string) => {
    // setItems(items => items.map(item => {
    //     if (item.i === id) {
    //         return { ...item, module: null }
    //     }
    //     return item
    // }))
    // setCurrIndex
    // }

    // const nestedModuleHeight = (props.contentHeight || 350) - (container?.clientHeight || 0) - 35 //35 is title's height

    //nestedModuleHeight=嵌套模块高度-icon图标高度-icon上下边距
    // const nestedModuleHeight = props.contentHeight! - DEFAULT_ROW_HEIGHT - DEFAULT_MARGIN * 2

    //根据点击的index渲染不同的模块
    const moduleToReactNode = (currIndex: number) => {
        console.log("switching module", props.content?.data?.tabItems, props.content)

        // 选中的element
        let submodule
        //根据tabItems获得elementName
        // 因为tabItems不一定有id，所以需要传递的elements的元素而不是tabItems
        if (props.content?.data?.tabItems) {
            const item = props.content?.data?.tabItems.find((item, i) => i === currIndex)

            const submoduleName = item?.name

            submodule = NestedDedicatedProps?.elements?.find((el) => el.name === submoduleName)
        }

        console.log(220, submodule)
        //有tab还不行，还需要tab是选择模块的
        if (!(submodule && submodule.type))
            return null

        console.log("switching moduleswitching module", props.content?.data?.tabItems, submodule)
        let { name, timeSeries, type, id } = submodule
        // if (!id) return null

        return (
            <ModuleTabPane
                key={currIndex + type + name}
                elementId={id as string}
                content={props.content}
                name={name}
                timeSeries={timeSeries}
                elementType={type}
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
        )
    }
    console.log(195, props.content)
    //get curr module tab pane
    const currModule = moduleToReactNode(props.content?.data?.currIndex)
    return (
        <div className={styles.Editor}>
            <div className={styles.DynamicHeader}>
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
                />

            </div>
            <div className={styles.currModule}>
                {/* {"on tab: " + currIndex} */}
                {currModule || <Skeleton active />}
            </div>
        </div>
    );
}

