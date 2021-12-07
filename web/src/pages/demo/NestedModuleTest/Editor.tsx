import DynamicHeader from './Header/DynamicHeader';
import { useEffect, useState } from 'react';
import { tabItem } from './data';
import { Skeleton } from 'antd';
import { Content, ElementType, StorageSimple } from '@/components/Gallery/GalleryDataType';
import { ModuleTabPane } from './EmbededModule/CreateModule';
import _, { min } from 'lodash';
import { Layout } from 'react-grid-layout';
import { DEFAULT_MARGIN, COLS_NUM, DEFAULT_ROW_HEIGHT } from './util';

interface NestedModuleProps {
    //for temp cache
    currIndex?: string,
    setCurrIndex?: React.Dispatch<React.SetStateAction<string>>,
    NSMid: string,
    items?: tabItem[]
    editable: boolean
    styling?: string//how to apply string as stying？
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    setSaveCount: React.Dispatch<React.SetStateAction<number>>
    updateContentFn: (content: Content) => void
    fetchStoragesFn: () => Promise<StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn?: (readOption: Content) => Promise<any>
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

export const NestedModuleEditor = (props: NestedModuleProps) => {
    //used to make sure the generated tab id is unique
    const counterPrefix = new Date()
    const { setItems, setSaveCount } = props

    const [currIndex, setCurrIndex] = useState(props.currIndex || "0")
    const [newCounter, setNewCounter] = useState(0)
    //determined when to ask parent to update content
    const [updateCnt, setUpdateCnt] = useState(0)

    //tabs layout updated
    useEffect(() => {
        setSaveCount(cnt => cnt + 1)
        // console.log(props.items)
    }, [props.items])

    //embeded modulePanal updated
    useEffect(() => {
        setSaveCount(cnt => cnt + 1)
        // console.log(items?.map(it => it.module))
    }, [updateCnt])

    //update curr index
    useEffect(() => {
        if (props.setCurrIndex) props.setCurrIndex(currIndex)
    }, [currIndex])

    //add new tabs
    const onAddItem = () => {

        let length = props.items?.length
        ////calculate new position
        let xPos = (length ? length : 0) % COLS_NUM
        let yPos = Math.floor((length ? length : 0) / COLS_NUM)
        setItems(items =>
            // Add a new item. It must have a unique key!
            items.concat({
                i: "" + counterPrefix + newCounter,
                x: xPos,
                y: yPos,
                w: 1,
                h: 1,
            }));
        // Increment the counter to ensure key is always unique.
        setNewCounter(cnt => cnt + 1)
    }

    //remove tabs
    const onRemoveItem = (i: string) => {
        setItems(its => its.filter(el => el.i !== i))
    }

    //switch the module(template) corresponding to different tabs
    const onSwitch = (i: string) => {
        setCurrIndex(i)
        setUpdateCnt(updateCnt + 1)
    }

    /*
    callback method responsing for resizing, adding, removing, and dragging elements in
    react-grid-layout. This method does 2 things:
    1. calculate current container width
    2. update the items list with new layout and newly calculated 
        minimal dimension of an item (details see updateElementInLayout)
    */
    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {

        //get container width
        const container = document.getElementById(props.NSMid)
        // console.log(container?.clientWidth)
        setItems(items => updateElementInLayout(items, layout, container?.clientWidth))
    };

    //callback to add a new module
    const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => {
        let content = { date: `${new Date()}`, data: { content: name } }
        //replace existing module
        if (props.items!.find(item => item.i === tabId && item.module)) {
            // console.log("removing old module...")
            //delete old module content
            onRemoveModule(tabId)
        }
        //add the new module to items list
        setItems(items => items.map((item) => {
            //update the json object
            if (item.i === tabId) {
                return { ...item, module: { name: name, timeSeries: timeSeries, elementType: moduleType, content: content } }
            }
            return item
        }))
        setUpdateCnt(updateCnt + 1)

    }

    const onRemoveModule = (id: string) => {
        setItems(items => items.map(item => {
            if (item.i === id) {
                return { ...item, module: null }
            }
            return item
        }))
    }

    //convert a module to reactNode based on id
    const moduleToReactNode = (id: string) => {
        let module = props.items?.find((item => item.i === id))?.module
        // console.log(items, module)
        //cases for unintialized module
        if (!module) return null
        let { name, timeSeries, elementType, content } = module
        // console.log("switching module", content)
        return (
            <ModuleTabPane
                key={id + elementType + name}
                tabId={id}
                content={content}
                name={name}
                timeSeries={timeSeries}
                elementType={elementType}
                editable={props.editable}
                setItems={setItems}
                onRemoveModule={onRemoveModule}
                fetchStoragesFn={props.fetchStoragesFn}
                fetchTableColumnsFn={props.fetchTableColumnsFn}
                fetchTableListFn={props.fetchTableListFn}
                fetchQueryDataFn={props.fetchQueryDataFn}
            />
        )
    }

    //get curr module tab pane
    const currModule = moduleToReactNode(currIndex)
    return (
        <div >
            <DynamicHeader
                items={props.items!}
                editable={props.editable}
                currIndex={currIndex}
                setItems={setItems}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onLayoutChange={onLayoutChange}
                onAddModule={onAddModule}
                onSwitch={onSwitch} />

            <div className="align-header">
                {/* {"on tab: " + currIndex} */}
                {currModule || <Skeleton />}

            </div>
        </div>
    );
}

