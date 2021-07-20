import './NestedModule.css';
import DynamicHeader from './DynamicHeader';
import { useEffect, useRef, useState } from 'react';
import { tabItem } from './data';
import { Button, Skeleton } from 'antd';
import { Content, ElementType, StorageSimple } from '@/components/Gallery/GalleryDataType';
import { ModuleTabPane, ModuleTabPaneRef } from './createModule';

const counterPostfix = new Date()

interface NestedSimpleModuleProps {
    items?: tabItem[]
    editable: boolean
    styling?: string//how to apply string as stying？
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    setSaveCount: React.Dispatch<React.SetStateAction<number>>
    updateContentFn: (content: Content) => void //how to submit content to db?
    fetchStoragesFn: () => Promise<StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn?: (readOption: Content) => Promise<any>
}

const defaultItems: tabItem[] = [0, 1, 2, 3, 4].map(function (i,) {
    return {
        i: i.toString(),
        x: i,
        y: 0,
        w: 1,
        h: 1,
        isResizable: false,
        text: i.toString(),
        autoSize: true,
        static: true,
    };
})
export const NestedSimpleModuleEditor = (props: NestedSimpleModuleProps) => {

    const { items, setItems, setSaveCount } = props
    //makesure items not null
    if (!items) {
        setItems(defaultItems)
    }
    const setLayout = useState<ReactGridLayout.Layout[]>([])[1]
    const [currIndex, setCurrIndex] = useState("0")
    // const [items, setItems] = useState(props.tabItems || [])
    const [newCounter, setNewCounter] = useState(0)
    const [editable, setEditable] = useState(props.editable)
    const [updateCnt, setUpdateCnt] = useState(0)

    const ref = useRef<ModuleTabPaneRef>(null)
    const startFetchContent = () => {
        console.log("in index, start fetch")
        const rf = ref.current
        if (rf) rf.startFetchContent()

    }
    useEffect(() => {
        // effect
        // console.log(items)
        onLayoutChange(items!)
        setSaveCount(cnt => cnt + 1)
    }, [items])

    useEffect(() => {
        startFetchContent()
        setSaveCount(cnt => cnt + 1)
    }, [updateCnt])

    useEffect(() => {
        setItems((items) => items.map(
            (ele) => ele = { ...ele, isDraggable: editable, static: !editable }))
        console.log(items)
    }, [editable])

    //add new tabs
    const onAddItem = () => {
        /*eslint no-console: 0*/
        console.log("adding", "n" + newCounter);
        setItems(items =>
            // Add a new item. It must have a unique key!
            items.concat({
                i: "" + counterPostfix + newCounter,
                x: (items.length) % (12),
                y: Math.floor((items.length) / (12)), // puts it at the bottom
                w: 1,
                h: 1,
                isResizable: false,
                text: "n" + newCounter,
            }));
        // Increment the counter to ensure key is always unique.
        setNewCounter(cnt => cnt + 1)
    }

    //remove tabs
    const onRemoveItem = (i: string) => {
        console.log("removing", i);
        // setItems({ items: _.reject(items, { i: i }) });
        setItems(its => its.filter(el => el.i !== i))
    }

    //switch the module(template) corresponding to different tabs
    const onSwitch = (i: string) => {
        setCurrIndex(i)
        setUpdateCnt(updateCnt + 1)
    }

    const toggleEdit = () => {
        setEditable(!editable)
    }
    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        setLayout(layout);
        // console.log(layout)
    };

    //called when the add a new module
    const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => {
        let content = { date: `${new Date()}`, data: { text: name, content: name } }
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
        //cases for unintialized module
        if (!module) return null
        let { name, timeSeries, elementType, content } = module
        return (
            <ModuleTabPane
                tabId={id}
                content={content}
                name={name}
                timeSeries={timeSeries}
                elementType={elementType}
                editable={editable}
                setItems={setItems}
                onRemoveModule={onRemoveModule}
                fetchStoragesFn={props.fetchStoragesFn}
                fetchTableColumnsFn={props.fetchTableColumnsFn}
                fetchTableListFn={props.fetchTableListFn}
                fetchQueryDataFn={props.fetchQueryDataFn}
                ref={ref}
            />
        )
    }

    //get curr module tab pane
    const currModule = moduleToReactNode(currIndex)
    return (
        <div className="App" >
            <Button onClick={toggleEdit} >{editable ? "Complete" : "Edit"}</Button>
            <DynamicHeader
                items={items!}
                editable={editable}
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

