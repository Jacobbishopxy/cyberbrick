import './NestedModule.css';
import DynamicHeader from './Header/DynamicHeader';
import { useEffect, useState } from 'react';
import { tabItem } from './data';
import { Skeleton } from 'antd';
import { Content } from '@/components/Gallery/GalleryDataType';
import { ModuleTabPane } from './EmbededModule/CreateModule';


interface NestedSimpleModuleProps {
    //for temp cache
    currIndex?: string,
    setCurrIndex?: React.Dispatch<React.SetStateAction<string>>,

    items?: tabItem[]
    editable: boolean
    styling?: string//how to apply string as stying？
    // updateContentFn: (content: Content) => void //how to submit content to db?
    // fetchStoragesFn?: () => Promise<StorageSimple[]>
    // fetchTableListFn?: (id: string) => Promise<string[]>
    // fetchTableColumnsFn?: (storageId: string, tableName: string) => Promise<string[]>
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
export const NestedSimpleModulePresentor = (props: NestedSimpleModuleProps) => {


    const [items, setItems] = useState(props.items || defaultItems)
    const setLayout = useState<ReactGridLayout.Layout[]>([])[1]
    const [currIndex, setCurrIndex] = useState(props.currIndex || "0")
    // const [items, setItems] = useState(props.tabItems || [])
    // const [updateCnt, setUpdateCnt] = useState(0)
    //update curr index
    useEffect(() => {
        if (props.setCurrIndex) props.setCurrIndex(currIndex)
    }, [currIndex])

    //switch the module(template) corresponding to different tabs
    const onSwitch = (i: string) => {
        setCurrIndex(i)
        // setUpdateCnt(updateCnt + 1)
    }
    //add new tabs
    const onAddItem = () => {
        //couldn't add on present mode
    }

    //remove tabs
    const onRemoveItem = (i: string) => {
        //couldn't remove on present mode
    }

    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        setLayout(layout);
        // console.log(layout)
    };

    const onAddModule = (name: string, timeSeries: boolean, moduleType: any, tabId: string) => {

    }
    const onRemoveModule = (id: string) => {
        //couldn't edit module content on presentmode
    }

    //convert a module to reactNode based on id
    const moduleToReactNode = (id: string) => {
        let module = items!.find((item => item.i === id))?.module
        //cases for unintialized module
        if (!module) return null
        let { name, timeSeries, elementType, content } = module
        // console.log("switching module", content)
        return (
            <ModuleTabPane key={id + elementType + name}
                tabId={id}
                content={content}
                name={name}
                timeSeries={timeSeries}
                elementType={elementType}
                editable={props.editable}
                setItems={setItems}
                onRemoveModule={onRemoveModule}
                fetchStoragesFn={() => Promise.resolve([])}
                fetchTableColumnsFn={(storageId, tableName) => Promise.resolve([])}
                fetchTableListFn={(id) => Promise.resolve([])}
                fetchQueryDataFn={props.fetchQueryDataFn}
            />
        )
    }

    //get curr module tab pane
    const currModule = moduleToReactNode(currIndex)
    return (
        <div  >
            <DynamicHeader
                items={items!}
                editable={false}
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

