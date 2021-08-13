import { today } from "@/components/Gallery/GalleryDataType"
import { ModuleEditorField, ModulePresenterField } from "@/components/Gallery/ModulePanel/Generator/data"
import { ModuleGenerator } from "@/components/Gallery/ModulePanel/Generator/ModuleGenerator"
import { useEffect, useState } from "react"
import { tabItem } from "./data"
import { NestedSimpleModuleEditor } from "./Editor"
import './style.css'
import { NSMid } from "./util"
const defaultItems: tabItem[] = [0].map(function (i, key, list) {
    return {
        i: i.toString(),
        x: i,
        y: 0,
        w: 1,
        h: 1,
        autoSize: true,
        static: false,
    }
})
const defaultData = { tabItems: defaultItems, currIndex: "0" }
const EditorField = (props: ModuleEditorField) => {
    /* content type: 
    currIndex: string (used to indicate the tab when entering)
    tabItem: tabItem[]: 
    for each item:
        id: i
        layout attribute: x y w h

        tab content attribute:
            tabContent: the content that will be displayed for a tab item
            tabType: the type of the content
            minDim: the minimal length between width and height. Used to calculate an item's font-size

        module: SimpleEmbededModule {
        name: string,
        timeSeries: boolean,
        elementType: ElementType,
        content?: Content
    }
    */

    let tempItems: tabItem[] = []
    if (props.content) {
        tempItems = props.content.data.tabItems as tabItem[]
    } else tempItems = defaultData.tabItems

    let tempIndex = "0"
    if (props.content) {
        tempIndex = props.content.data.currIndex
    }

    const [items, setItems] = useState<tabItem[]>(tempItems)
    const [currIndex, setCurrIndex] = useState(tempIndex)
    const [saveCount, setSaveCount] = useState(0)


    useEffect(() => {
        props.updateContent({ ...props.content, date: today(), data: { tabItems: items, currIndex: currIndex } })
        // console.log(props.content)
    }, [saveCount])
    return (
        <div id={NSMid}>
            <NestedSimpleModuleEditor
                currIndex={currIndex}
                setCurrIndex={setCurrIndex}
                items={items as tabItem[]}
                setItems={setItems}
                setSaveCount={setSaveCount}
                fetchStoragesFn={props.fetchStorages!}
                fetchTableListFn={props.fetchTableList!}
                fetchTableColumnsFn={props.fetchTableColumns!}
                updateContentFn={props.updateContent}
                editable={true}
                styling={props.styling}
                NSMid={NSMid}
            />
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) => {

    const setItems = useState<tabItem[]>([])[1]
    const [currIndex, setCurrIndex] = useState("")
    const [saveCount, setSaveCount] = useState(0)
    useEffect(() => {
        props.updateContent({ ...props.content, date: today(), data: { ...props.content?.data, currIndex: currIndex } })
        // console.log(props.content)
    }, [saveCount])
    //use Editor and set editable to false so that it can receive and update the new content fetched from db
    return (props.content?.data?.tabItems ?
        <div className={props.styling}>
            <NestedSimpleModuleEditor
                items={props.content?.data.tabItems as tabItem[]}
                currIndex={props.content?.data.currIndex}
                setCurrIndex={setCurrIndex}
                setItems={setItems}
                editable={false}
                styling={props.styling}
                NSMid={NSMid}
                fetchStoragesFn={() => Promise.resolve([])}
                fetchTableColumnsFn={(storageId, tableName) => Promise.resolve([])}
                fetchTableListFn={(id) => Promise.resolve([])}
                // fetchQueryDataFn={props.fetchQueryData}
                updateContentFn={props.updateContent}
                setSaveCount={setSaveCount}
            />
        </div> : <></>)
}
export const NestedSimpleModule = new ModuleGenerator(EditorField, PresenterField).generate()