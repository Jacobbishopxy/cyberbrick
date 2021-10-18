/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useContext } from "react"

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"

import { PropsContext } from "../Dashboard"

export interface ContainerElementProps {
    parentInfo: string[]
    timeSeries?: boolean
    editable: boolean
    element: DataType.Element
    shouldStartFetch: number
    isNested?: boolean
    fetchContentFn?: (id: string | undefined, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
    updateContentFn: (content: DataType.Content) => void
    onRemove: () => void
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
    updateDescription: (ele: string) => void
    // onTEfetchContent: (eleId: string, elementType: DataType.ElementType, date?: string | undefined) => Promise<DataType.Content | undefined>
}

export interface ContainerElementRef {
    fetchContent: (date?: string) => void
    fetchContentDates: () => Promise<string[]>
}


/**
 * Template's elements
 */
export const TemplateElement =
    forwardRef((props: ContainerElementProps, ref: React.Ref<ContainerElementRef>) => {

        const DashboardProps = useContext(PropsContext)
        console.log(44, DashboardProps, props.isNested)

        const mpRef = useRef<HTMLDivElement>(null)

        const [mpHeight, setMpHeight] = useState<number>(0)
        const [content, setContent] = useState<DataType.Content>()
        const eleId = props.element.id as string | undefined

        const [isLoading, setIsLoading] = useState(true);
        useLayoutEffect(() => {
            if (mpRef.current) setMpHeight(mpRef.current.offsetHeight)
        })

        /**
         * Template Element may be nested in a module, so we have different fetch api
         * If TemplateElment is nested, eleId is actually tabId.
         */

        /* 
            DynamicHeader组件需要的数据从这里网络请求回来
        */
        const fetchContent = (date?: string) => {
            console.log(66, eleId, props.isNested)
            if (eleId) {
                //no need to check date since it's allowed date to be undefined
                // props.fetchContentFn(eleId, date, props.isNested).then(res => {
                DashboardProps?.fetchElementContent!(eleId, date, props.isNested).then(res => {
                    // fetchElementContent(eleId, date, props.isNested).then(res => {
                    console.log(71, eleId)
                    //TODO: cannot set content to undefined
                    const ct = res || { data: {}, date: DataType.today() }

                    setContent(ct)
                    // if (props.isNested) console.log(ct)
                    props.updateContentFn(ct)
                    // onReceiveContentFromFetch(res as DataType.Content, props.isNested)
                })
                //no matter what we receive, wait till if statement end to stop loading
                setIsLoading(false)
            }
        }







        //listen to props's shouldStartFetch. If it updates, fetchContent
        //获取content内容，依赖项是
        useEffect(() => {
            fetchContent()
        }, [props.shouldStartFetch])

        const fetchContentDates = async () => {
            if (eleId && props.element.timeSeries) {
                const ele = await props.fetchContentDatesFn(eleId)
                return ele.contents!.map(c => DataType.timeToString(c.date))
            }
            return []
        }

        useImperativeHandle(ref, () => ({ fetchContent, fetchContentDates }))

        const updateContent = (ctt: DataType.Content) => props.updateContentFn(ctt)

        return (
            <div style={{ height: "100%" }} ref={mpRef} >
                <ModulePanel
                    parentInfo={props.parentInfo}
                    eleId={eleId}
                    headName={props.element.name}
                    timeSeries={props.timeSeries}
                    elementType={props.element.type}
                    description={props.element.description}
                    content={content}
                    fetchStorages={props.fetchStoragesFn}
                    fetchTableList={props.fetchTableListFn}
                    fetchTableColumns={props.fetchTableColumnsFn}
                    fetchQueryData={props.fetchQueryDataFn}
                    contentHeight={mpHeight}
                    /* head 点击日历按钮获取数据的方法 */
                    //!改
                    fetchContent={fetchContent}
                    fetchContentDates={fetchContentDates}
                    updateContent={updateContent}
                    onRemove={props.onRemove}
                    editable={props.editable}
                    settable={!!eleId}
                    isLoading={isLoading}

                    updateDescription={props.updateDescription}
                    /* 嵌套模块也需要获得content，就通过这个传入的这个函数获得 */
                    //!改
                    fetchContentFn={DashboardProps?.fetchElementContent}
                    fetchContentDatesFn={props.fetchContentDatesFn}
                    isNested={props.isNested}
                />
            </div>
        )
    })

TemplateElement.defaultProps = {
    markAvailable: false,
    timeSeries: false
} as Partial<ContainerElementProps>

