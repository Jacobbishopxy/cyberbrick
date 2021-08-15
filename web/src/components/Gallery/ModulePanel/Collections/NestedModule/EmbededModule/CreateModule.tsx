import * as DataType from "../../../../GalleryDataType"
import { useState } from "react"
import { tabItem } from "../data"
import { TemplateElement } from "@/components/Gallery/Dashboard/DashboardContainer/TemplateElement"

interface ModuleTabPaneProps {
    //self custom
    tabId: string,
    content?: DataType.Content
    //same as TemplateElementProps
    editable: boolean,
    name: string,
    timeSeries: boolean,
    elementType: DataType.ElementType,

    shouldEleStartFetch: number
    onRemoveModule: (id: string) => void,
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
    fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>

}



export const ModuleTabPane = (props: ModuleTabPaneProps) => {
    const { name, timeSeries, elementType, tabId } = props
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    //layout property is not important?
    const ele: DataType.Element = { id: tabId, name: name, timeSeries: timeSeries, type: elementType, x: 0, y: 0, h: 0, w: 0 }


    //TODO: only call props.fetchContent in the first call
    const fetchContent = async (id: string, date?: string) => {
        if (content?.data) return props.content
        if (props.content?.id) {
            console.log("fetch from db", props.content)
            return props.fetchContentFn(props.content?.id, date, true)
        }
        return props.content
    }

    const updateContent = (c: DataType.Content) => {
        setContent(c)
        //update the content in items list
        props.setItems(items => items.map(item => {
            if (item.i === tabId) {
                let mod = item.module
                return { ...item, module: { ...mod, content: c } }
            }
            return item
        }))
    }

    const onRemove = () => {
        props.onRemoveModule(tabId)
    }

    //TODO: WARINING! hardcoded height
    return (
        <div style={{ height: "390px" }}>
            <TemplateElement key={tabId + elementType + name}
                parentInfo={[]}
                timeSeries={timeSeries}
                editable={props.editable}
                element={ele}
                fetchContentFn={fetchContent}
                fetchContentDatesFn={props.fetchContentDatesFn}
                updateContentFn={updateContent}
                onRemove={onRemove}
                fetchStoragesFn={props.fetchStoragesFn}
                fetchTableListFn={props.fetchTableListFn}
                fetchTableColumnsFn={props.fetchTableColumnsFn}
                fetchQueryDataFn={props.fetchQueryDataFn}
                ref={null}
                shouldStartFetch={props.shouldEleStartFetch}
                isNested={true}
            />
        </div>
    )


}