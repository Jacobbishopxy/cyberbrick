
import { ContainerElementRef, TemplateElement } from "./TemplateElement"
import { Content, ElementType, StorageSimple } from "@/components/Gallery/GalleryDataType"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { tabItem } from "./data"

interface ModuleTabPaneProps {
    //self custom
    tabId: string,
    content?: Content
    //same as TemplateElementProps
    editable: boolean,
    name: string,
    timeSeries: boolean,
    elementType: ElementType,
    onRemoveModule: (id: string) => void,
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    fetchStoragesFn: () => Promise<StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn?: (readOption: Content) => Promise<any>

}
export interface ModuleTabPaneRef {
    startFetchContent: () => void;
}
const tempContent: Content = {
    date: `${new Date()}`,
    data: {
        content: "content",
        text: "text"
    }
}

export const ModuleTabPane = forwardRef((props: ModuleTabPaneProps, ref: React.Ref<ModuleTabPaneRef>) => {

    //fetch the content by calling props' method: fetchContent()
    const teRefs = useRef<ContainerElementRef>(null)
    const startFetchContent = () => {
        console.log("in moduleTabPane, start fetching")
        const rf = teRefs.current
        console.log(rf)
        if (rf) {
            console.log("start fetching")
            rf.fetchContent()
        }
    }
    //expose this method to parent component
    useImperativeHandle(ref, () => ({ startFetchContent }))

    const { name, timeSeries, elementType, tabId } = props
    const [content, setContent] = useState<Content | undefined>(props.content)

    //simply returned the content received from parent
    //TODO: redesign
    const fetchContent = (id: string, data?: string) => {
        console.log(id, data)
        if (!content) {
            setContent(tempContent)
        }
        return Promise.resolve(content)
    }

    const updateContent = (c: Content) => {
        console.log(c)
        setContent(c)
        //update the content in items list
        props.setItems(items => items.map(item => {
            if (item.i === tabId) return { ...item, content: c }
            return item
        }))
    }

    //TODO: redesign
    //hardcode the single module layout
    const elements = [
        {
            id: tabId,
            name: name,
            type: elementType,
            timeSeries: timeSeries,
            x: 0,
            y: 0,
            h: 20,
            w: 12,
        }
    ]

    //TODO: implement the details
    //warning! hardcoded height
    return (
        <div style={{ height: "390px" }}>
            <TemplateElement
                parentInfo={[]}
                timeSeries={timeSeries}
                editable={props.editable}
                element={elements[0]}
                onRemove={() => props.onRemoveModule(tabId)}
                fetchContentFn={fetchContent}
                updateContentFn={updateContent}
                fetchStoragesFn={props.fetchStoragesFn}
                fetchTableListFn={props.fetchTableListFn}
                fetchTableColumnsFn={props.fetchTableColumnsFn}
                fetchQueryDataFn={props.fetchQueryDataFn}
                ref={teRefs}
            />
        </div>
    )


})