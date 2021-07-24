import './NestedModule.css';
import DynamicHeader from './Header/DynamicHeader';
import { useEffect, useState } from 'react';
import { tabItem } from './data';
import { Skeleton } from 'antd';
import { Content, ElementType, StorageSimple } from '@/components/Gallery/GalleryDataType';
import { ModuleTabPane } from './EmbededModule/CreateModule';
import _ from 'lodash';

interface NestedSimpleModuleProps {
    //for temp cache
    currIndex?: string,
    setCurrIndex?: React.Dispatch<React.SetStateAction<string>>,

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

export const NestedSimpleModuleEditor = (props: NestedSimpleModuleProps) => {
    const counterPostfix = new Date()
    const { items, setItems, setSaveCount } = props
    //makesure items not null
    // if (!items) {
    //     setItems(defaultItems)
    // }
    // const [layout, setLayout] = useState<ReactGridLayout.Layout[]>([])
    const [currIndex, setCurrIndex] = useState(props.currIndex || "0")
    // const [items, setItems] = useState(props.tabItems || [])
    const [newCounter, setNewCounter] = useState(0)
    const [updateCnt, setUpdateCnt] = useState(0)

    //tabs layout updated
    useEffect(() => {
        // effect
        console.log("items change")
        // onLayoutChange(items!)
        setSaveCount(cnt => cnt + 1)
    }, [items])

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
        setItems(items =>
            // Add a new item. It must have a unique key!
            items.concat({
                i: "" + counterPostfix + newCounter,
                //there's an "add tab"
                x: (items.length ? items.length - 1 : 0) % (12),
                y: Math.floor((items.length ? items.length - 1 : 0) / (12)), // puts it at the bottom
                w: 1,
                h: 1,
                text: "n" + newCounter,
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

    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        // setItems(updateElementInLayout(items!, layout))
        console.log("items updated")
        // setLayout(layout);
        setItems(items => items.map(item => {
            let layoutItem = layout.find(lay => lay.i === item.i)
            if (layoutItem) return {
                ...item, x: layoutItem.x, y: layoutItem.y,
                w: layoutItem.w, h: layoutItem.h
            }
            return item
        }))
    };

    //called when the add a new module
    const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => {
        let content = { date: `${new Date()}`, data: { content: name } }
        //replace existing module
        if (items!.find(item => item.i === tabId && item.module)) {
            console.log("removing old module...")
            //delete old module content
            onRemoveModule(tabId)
        }

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
        let module = items!.find((item => item.i === id))?.module
        // console.log(items, module)
        //cases for unintialized module
        if (!module) return null
        let { name, timeSeries, elementType, content } = module
        console.log("switching module", content)
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
            {/* <Button onClick={toggleEdit} >{editable ? "Complete" : "Edit"}</Button> */}
            <DynamicHeader
                items={items!}
                editable={props.editable}
                setItems={setItems}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onLayoutChange={onLayoutChange}
                onAddModule={onAddModule}
                onSwitch={onSwitch} />

            <div>
                {"on tab: " + currIndex}
                {currModule || <Skeleton />}

            </div>
        </div>
    );
}

