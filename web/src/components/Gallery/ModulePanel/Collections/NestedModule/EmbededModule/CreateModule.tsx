import * as DataType from "../../../../GalleryDataType"
import { tabItem } from "../data"
import { TemplateElement } from "@/components/Gallery/Dashboard/DashboardContainer/TemplateElement"
import { useEffect, useState, useContext } from "react"

import { DashboardContext } from "@/components/Gallery/Dashboard/DashboardContext"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
interface ModuleTabPaneProps {
    //self custom
    elementId: string,
    content?: DataType.Content
    //same as TemplateElementProps
    editable: boolean,
    name: string,
    timeSeries: boolean,
    elementType: DataType.ElementType,
    contentHeight?: number
    shouldEleStartFetch: number
    // onRemoveModule: (id: string) => void,
    // setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
    fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>

    setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
}


export interface ModuleTabPaneRef {
    fetched: boolean
}

export const ModuleTabPane = (props: ModuleTabPaneProps) => {
    const { name, timeSeries, elementType, elementId } = props
    //layout property is not important?
    const ele: DataType.Element = {
        id: elementId,
        name: name,
        timeSeries: timeSeries,
        type: elementType,
        x: 0, y: 0, h: 0, w: 0
    }
    const [shouldFetch, setShouldFetch] = useState(0)
    const dashboardContextProps = useContext(DashboardContext)

    useEffect(() => {
        if (!props.content?.data) setShouldFetch(s => s + 1)
    }, [props.content?.data])


    // const fetchContent = async (id: string, date?: string, isNested?: boolean) => {
    // console.log("restarting?", props.content?.data)
    //TODO: WARNING! Refetch logic only works when content received from db has not null data
    // if (props.content?.data) return props.content
    // if (props.content?.id) {
    //     // console.log("fetch from db", props.content)

    //     return props.fetchContentFn(props.content?.id, date, true)
    // }
    // return props.content

    //     return props.fetchContentFn(id, date, true)
    // }


    //更新contents,在这里加入element的信息
    const setNewestContent = (c: DataType.Content) => {
        if (props.setNewestContent) {
            props.setNewestContent(c, {
                id: ele.id,
                name: ele.name,
                type: ele.type
            })
        }
    }

    // const onRemove = () => {
    //     props.onRemoveModule(elementId)
    // }

    const NestedDedicatedProps = useContext(nestedDedicatedContext)
    console.log(72, dashboardContextProps)
    //TODO: WARINING! hardcoded height
    return (
        // <div style={{ height: props.contentHeight }} >
        <div style={{ height: '100%' }} >
            {/* <DashboardContext.Provider value={{
                fetchElementContent: fetchContent,
            }}> */}
            <TemplateElement key={elementType + name}
                parentInfo={NestedDedicatedProps?.parentInfo}
                timeSeries={timeSeries}
                editable={props.editable}
                element={ele}
                // fetchContentFn={fetchContent}
                fetchContentDatesFn={props.fetchContentDatesFn}
                //更新contents
                setNewestContent={setNewestContent}
                //删除
                // onRemove={onRemove}
                fetchStoragesFn={props.fetchStoragesFn}
                fetchTableListFn={props.fetchTableListFn}
                fetchTableColumnsFn={props.fetchTableColumnsFn}
                fetchQueryDataFn={props.fetchQueryDataFn}
                ref={null}
                shouldStartFetch={shouldFetch}
                isNested={true}
                updateDescription={(ele: string) => { }}
            />
            {/* </DashboardContext.Provider> */}
        </div>
    )
}