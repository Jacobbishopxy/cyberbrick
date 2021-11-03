/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useContext } from "react"

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"

import { DashboardContext } from "../DashboardContext"
import { message } from "antd"
import _ from 'lodash'
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

        const DashboardProps = useContext(DashboardContext)

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

        //当第一次没有content时，根据模块类型初始化content
        function getInitContent() {
            let initContent: DataType.Content;

            switch (props.element.type) {
                case DataType.ElementType.NestedModule:
                    initContent = {
                        data: {
                            currIndex: -1,
                            tabItems: []
                        },
                        date: DataType.today()
                    }
                    break;
                case DataType.ElementType.XlsxTable:
                    initContent = {
                        data: {
                            collection: 'xlsxTable',
                            source: {}
                        },
                        date: DataType.today()

                    }
                default:
                    initContent = {
                        data: {},
                        date: DataType.today()
                    }
                    break;
            }

            if (props.timeSeries) {
                initContent.date = ''
            }
            return initContent
        }
        /* 
            element需要的数据从这里网络请求回来
        */
        const fetchContent = (date?: string) => {
            return new Promise((resoleve, reject) => {
                if (eleId) {
                    //no need to check date since it's allowed date to be undefined
                    // props.fetchContentFn(eleId, date, props.isNested).then(res => {
                    DashboardProps?.fetchElementContent!(eleId, date, props.isNested).then(res => {
                        // fetchElementContent(eleId, date, props.isNested).then(res => {
                        //TODO: cannot set content to undefined
                        const ct = res || getInitContent()
                        //  { data: {}, date: DataType.today() }
                        console.log(6767, props.isNested, ct)


                        try {
                            setContent(ct)
                            // if (props.isNested) console.log(ct)


                            resoleve(ct)
                        } catch (error) {
                            // setContent(_.omit(ct, 'text'))
                            message.error('数据加载错误:' + error)
                        }
                        // onReceiveContentFromFetch(res as DataType.Content, props.isNested)
                    })
                    //no matter what we receive, wait till if statement end to stop loading
                    setIsLoading(false)
                }
            })
        }
        //集中处理：不用分布式的存入，每当content改变后都存入contents数组。最终调用的saveContent会判断是否修改与增加。
        useEffect(() => {
            if (content) {
                props.updateContentFn(content)
            }
        }, [content])


        //listen to props's shouldStartFetch. If it updates, fetchContent
        //获取content内容，依赖项是
        useEffect(() => {
            fetchContent()
        }, [props.shouldStartFetch])

        //获取模块的时间序列
        const fetchContentDates = async () => {
            if (eleId && props.element.timeSeries) {

                console.log(119, props.isNested, props.element)

                const ele = await props.fetchContentDatesFn(eleId)
                return ele.contents!.map(c => (c.date))
            }
            return []
        }

        useImperativeHandle(ref, () => ({ fetchContent, fetchContentDates }))

        const updateContent = (ctt: DataType.Content) => props.updateContentFn(ctt)
        if (props.isNested) {
            console.log(104, props.isNested, props)
        }
        return (
            <div
                style={{ height: '99%' }
                }
                ref={mpRef} >
                <ModulePanel
                    parentInfo={props.parentInfo}
                    eleId={eleId}
                    //模块的名字
                    headName={props.element.name}
                    //是否时间序列
                    timeSeries={props.timeSeries}
                    //模块类型
                    elementType={props.element.type}
                    description={props.element.description}
                    content={content}
                    setContent={setContent}
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

