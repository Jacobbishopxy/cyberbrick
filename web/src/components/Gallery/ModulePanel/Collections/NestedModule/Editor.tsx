import DynamicHeader from './Header/DynamicHeader';
import { useEffect, useState } from 'react';
import { tabItem } from './data';
import { Skeleton } from 'antd';
import { ModuleTabPane } from './EmbededModule/CreateModule';
import _, { min } from 'lodash';
import { Layout } from 'react-grid-layout';
import { DEFAULT_MARGIN, COLS_NUM, DEFAULT_ROW_HEIGHT } from './util';
import * as DataType from "../../../GalleryDataType"

import styles from './style.less'
interface NestedSimpleModuleProps {
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
    updateContentFn: (content: DataType.Content) => void
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>

    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
    fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
    content?: DataType.Content
    setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
}


/*
helper method for onLayoutChnage; 
@param rawLayout: the modified layout
@param elements: the object that stores the content of this module
*/
const updateElementInLayout = (elements: tabItem[], rawLayout: Layout[], containerWidth?: number): tabItem[] =>
    _.zip(elements, rawLayout).map(zItem => {
        const ele: tabItem = zItem[0]!
        const rawEle: Layout = zItem[1]!
        if (!rawEle) return ele
        let colMinSize = 64 //set defualt to 64 so that defualt font size is 32
        //if there's a containerWidth, calculate the minimal dimension among width and height
        if (containerWidth) {
            let colUnitWidth = (containerWidth - DEFAULT_MARGIN * (COLS_NUM - 1)) / COLS_NUM
            colMinSize = min([colUnitWidth * rawEle.w, DEFAULT_ROW_HEIGHT * rawEle.h])!
        }
        //update the layout properties in element
        return {
            ...ele,
            x: rawEle.x,
            y: rawEle.y,
            h: rawEle.h,
            w: rawEle.w,
            minDim: colMinSize!
        }
    })

export const NestedSimpleModuleEditor = (props: NestedSimpleModuleProps) => {
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
    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {

        //get container width
        // setItems(items => updateElementInLayout(items, layout, container?.clientWidth))
    };

    //callback to add a new module
    const onAddModule = (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => {
        let content = { date: DataType.today(), data: { content: name } }
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
        setUpdateCnt(updateCnt + 1)

    }

    const onRemoveModule = (id: string) => {
        // setItems(items => items.map(item => {
        //     if (item.i === id) {
        //         return { ...item, module: null }
        //     }
        //     return item
        // }))
        // setCurrIndex
    }

    // const nestedModuleHeight = (props.contentHeight || 350) - (container?.clientHeight || 0) - 35 //35 is title's height

    //nestedModuleHeight=嵌套模块高度-icon图标高度-icon上下边距
    const nestedModuleHeight = props.contentHeight! - DEFAULT_ROW_HEIGHT - DEFAULT_MARGIN * 2

    //convert a module to reactNode based on id
    const moduleToReactNode = (currIndex: string) => {
        let Submodule = props.content?.data?.tabItems.find((item, i) => i === currIndex)

        if (!Submodule)
            return null


        let { name, timeSeries, elementType, content } = Submodule
        console.log("did content receive currIndex?", content)
        content = { ...content, tabId: currIndex }
        console.log("switching module", content)
        return (
            <ModuleTabPane
                key={currIndex + elementType + name}
                tabId={currIndex}
                content={props.content}
                name={name}
                timeSeries={timeSeries}
                elementType={elementType}
                editable={props.editable}
                // contentHeight={nestedModuleHeight}
                // setItems={setItems}
                onRemoveModule={onRemoveModule}
                fetchStoragesFn={props.fetchStoragesFn}
                fetchTableColumnsFn={props.fetchTableColumnsFn}
                fetchTableListFn={props.fetchTableListFn}
                fetchQueryDataFn={props.fetchQueryDataFn}

                fetchContentFn={props.fetchContentFn}
                fetchContentDatesFn={props.fetchContentDatesFn}
                shouldEleStartFetch={1 /** template element should fetch content only when it's mounted*/}
            />
        )
    }

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
                    onLayoutChange={onLayoutChange}
                    onAddModule={onAddModule}
                    content={props.content}
                    setContent={props.setContent}
                // onSwitch={onSwitch} 
                />

            </div>
            <div className={styles.currModule}>
                {/* {"on tab: " + currIndex} */}

                {currModule || <Skeleton active />}

            </div>
        </div>
    );
}

