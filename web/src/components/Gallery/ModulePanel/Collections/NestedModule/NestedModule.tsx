import { today } from "@/components/Gallery/GalleryDataType"
import { ModuleEditorField, ModulePresenterField } from "@/components/Gallery/ModulePanel/Generator/data"
import { ModuleGenerator } from "@/components/Gallery/ModulePanel/Generator/ModuleGenerator"
import { useEffect, useState } from "react"
import { tabItem } from "./data"
import { NestedSimpleModuleEditor } from "./NestedSimpleModuleEditor"
import { NestedSimpleModulePresentor } from "./NestedSimpleModulePresentor"

// interface NSMEditorProps extends ModuleEditorField {
//   fetchContentFn: (id: string, date?: string) => Promise<Element>
//   fetchContentDatesFn: (id: string, markName?: string) => Promise<Element>
//   fetchQueryDataFn: (readOption: Content) => Promise<any>
// }
const defaultItems: tabItem[] = [0].map(function (i, key, list) {
    return {
        i: i.toString(),
        x: i,
        y: 0,
        w: 1,
        h: 1,
        isResizable: false,
        text: i.toString(),
        autoSize: true,
        static: false,
    };
})

const defaultData = { tabItems: defaultItems, currIndex: "0" }
const EditorField = (props: ModuleEditorField) => {
    //content type: 
    //currIndex: string (used to indicate the tab when entering)
    //tabItem: tabItem[]: 
    /* for each item
    id: i
    layout attribute: x y w h
    module: SimpleEmbededModule {
      name: string,
      timeSeries: boolean,
      elementType: ElementType,
      content?: Content
  }
    */

    let tempItems: tabItem[] = [];
    if (props.content) {
        tempItems = props.content.data.tabItems as tabItem[]
    } else tempItems = defaultData.tabItems

    let tempIndex = "0";
    if (props.content) {
        tempIndex = props.content.data.currIndex
    }
    // const [items, setItems] = useState<tabItem[]>(tempContent.data as tabItem[] || defaultItems)
    const [items, setItems] = useState<tabItem[]>(tempItems)
    const [currIndex, setCurrIndex] = useState(tempIndex)
    const [saveCount, setSaveCount] = useState(0)

    useEffect(() => {
        props.updateContent({ ...props.content, date: today(), data: { tabItems: items, currIndex: currIndex } })
        // console.log(items)
        return () => {
            //
        }
    }, [saveCount])
    return (
        <div >
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
            />
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) => {
    // console.log(props.content)
    return (props.content ?
        <div className={props.styling}>
            <NestedSimpleModulePresentor
                //  updateContentFn={props.updateContent} 
                items={props.content?.data.tabItems as tabItem[]}
                currIndex={props.content?.data.currIndex}
                editable={false}
                styling={props.styling}
            />
        </div> : <></>)
}
export const NestedSimpleModule = new ModuleGenerator(EditorField, PresenterField).generate()