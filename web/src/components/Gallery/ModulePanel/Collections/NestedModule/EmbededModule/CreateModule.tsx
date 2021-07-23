

import { Content, ElementType, StorageSimple } from "@/components/Gallery/GalleryDataType"
import { useState } from "react"
import { tabItem } from "../data"
import { ModulePanel } from "@/components/Gallery/ModulePanel/Panel"

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

const tempContent: Content = {
    date: `${new Date()}`,
    data: {
        content: "content",
        text: "text"
    }
}

export const ModuleTabPane = (props: ModuleTabPaneProps) => {
    const { name, timeSeries, elementType, tabId } = props
    const [content, setContent] = useState<Content | undefined>(props.content)

    //simply returned the content received from parent
    const fetchContent = (date?: string) => {
        if (!content) {
            setContent(tempContent)
        }
        // return Promise.resolve(content)
    }

    const updateContent = (c: Content) => {
        console.log(c)
        setContent(c)
        //update the content in items list
        props.setItems(items => items.map(item => {
            if (item.i === tabId) {
                let mod = item.module
                return { ...item, module: { ...mod, content: c } }
            }
            return item
        }))
        console.log()
    }

    const onRemove = () => {
        props.onRemoveModule(tabId)
    }
    const convertContent = elementType === "xlsxTable" ? { ...content, date: content?.date!, data: [content!.data] } : content
    //TODO: implement the details
    //warning! hardcoded height
    return (
        <div style={{ height: "390px" }}>
            <ModulePanel key={tabId + elementType + name}
                parentInfo={[]}
                eleId={tabId}
                headName={name}
                timeSeries={timeSeries}
                elementType={elementType}
                content={convertContent}
                fetchStorages={props.fetchStoragesFn}
                fetchTableList={props.fetchTableListFn}
                fetchTableColumns={props.fetchTableColumnsFn}
                fetchQueryData={props.fetchQueryDataFn}
                contentHeight={400}
                fetchContent={fetchContent}
                // fetchContentDates={fetchContentDates}
                updateContent={updateContent}
                onRemove={onRemove}
                editable={props.editable}
                settable={!!tabId} />
        </div>
    )


}