import * as DataType from "../../../../GalleryDataType"
import { tabItem } from "../data"
import { TemplateElement } from "@/components/Gallery/Dashboard/DashboardContainer/TemplateElement"
import { useEffect, useState } from "react"

import { DashboardContext } from "@/components/Gallery/Dashboard/DashboardContext"
interface ModuleTabPaneProps {
    //self custom
    tabId: string,
    content?: DataType.Content
    //same as TemplateElementProps
    editable: boolean,
    name: string,
    timeSeries: boolean,
    elementType: DataType.ElementType,
    contentHeight?: number
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


export interface ModuleTabPaneRef {
    fetched: boolean
}

export const ModuleTabPane = (props: ModuleTabPaneProps) => {
    const { name, timeSeries, elementType, tabId } = props
    //layout property is not important?
    const ele: DataType.Element = { id: tabId, name: name, timeSeries: timeSeries, type: elementType, x: 0, y: 0, h: 0, w: 0 }
    const [shouldFetch, setShouldFetch] = useState(0)


    useEffect(() => {
        if (!props.content?.data) setShouldFetch(s => s + 1)
    }, [props.content?.data])


    const fetchContent = async (id: string, date?: string, isNested?: boolean) => {
        // console.log("restarting?", props.content?.data)
        //TODO: WARNING! Refetch logic only works when content received from db has not null data
        if (props.content?.data) return props.content
        if (props.content?.id) {
            // console.log("fetch from db", props.content)

            return props.fetchContentFn(props.content?.id, date, true)
        }
        return props.content
    }

    const updateContent = (c: DataType.Content) => {
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
        // <div style={{ height: props.contentHeight }} >
        <div style={{ height: '100%' }} >
            <DashboardContext.Provider value={{
                fetchElementContent: fetchContent
            }}>
                <TemplateElement key={tabId + elementType + name}
                    parentInfo={[]}
                    timeSeries={timeSeries}
                    editable={props.editable}
                    element={ele}
                    // fetchContentFn={fetchContent}
                    fetchContentDatesFn={props.fetchContentDatesFn}
                    updateContentFn={updateContent}
                    onRemove={onRemove}
                    fetchStoragesFn={props.fetchStoragesFn}
                    fetchTableListFn={props.fetchTableListFn}
                    fetchTableColumnsFn={props.fetchTableColumnsFn}
                    fetchQueryDataFn={props.fetchQueryDataFn}
                    ref={null}
                    shouldStartFetch={shouldFetch}
                    isNested={true}
                    updateDescription={(ele: string) => { }}
                />
            </DashboardContext.Provider>

        </div>
    )
}