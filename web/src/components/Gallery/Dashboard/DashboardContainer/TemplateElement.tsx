/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useContext } from "react"

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"

import { DashboardContext } from "../DashboardContext"
import { message } from "antd"
import _ from 'lodash'
import e from "@umijs/deps/compiled/express"
import { await } from "signale"
export interface ContainerElementProps {
    parentInfo: object
    timeSeries?: boolean
    editable: boolean
    element: DataType.Element
    shouldStartFetch: number
    isNested?: boolean
    fetchContentFn?: (id: string | undefined, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
    updateContentFn?: (content: DataType.Content) => void
    onRemove: () => void
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
    updateDescription: (ele: string) => void
    addElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
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

        const dashboardContextProps = useContext(DashboardContext)

        const mpRef = useRef<HTMLDivElement>(null)

        const [mpHeight, setMpHeight] = useState<number>(0)
        const [content, setContent] = useState<DataType.Content>()

        const element = props.element
        const eleId = props.element.id as string | undefined

        const [isLoading, setIsLoading] = useState(true);
        useLayoutEffect(() => {
            if (mpRef.current) setMpHeight(mpRef.current.offsetHeight)
        })

        //表示当前模块要显示的内容日期，换句话说，没有date就没有内容。
        const [date, setDate] = useState<string>('')

        //每当content改变后都存入allContent数组。最终调用的saveContent会判断是否修改与增加。
        //写在此文件中集中处理
        useEffect(() => {
            console.log(152, content)
            if (content) {
                if (props.updateContentFn) {
                    props.updateContentFn(content)
                }
                if (content.data) {
                    setDate(content.date)
                }
            }
        }, [content])

        //获取content内容，依赖项是
        useEffect(async () => {
            console.log(78, date)
            let t_content
            if (date) {
                let t_date = date
                t_date = DataType.today(t_date)
                console.log(81, date)
                t_content = await getContent(t_date)
            } else {
                t_content = await getContent()
            }
            setContent(t_content)
        }, [props.shouldStartFetch, date])

        //从allContent获取；如果没有，DB获取；如果没有，初始化
        async function getContent(date?: string) {
            const t_content = getContentOfAllContent()
            console.log(78, t_content)
            if (t_content) {
                console.log(79, t_content)
                return t_content
            } else {
                const t_content = await getContentOfDB(date)
                console.log(79999, t_content)
                if (t_content) {
                    console.log(799, t_content)
                    return t_content
                } else {
                    return getInitContent(date)
                }
            }
        }

        // 从allContent查找数据，条件是name和date，有返回true，没有返回false
        function getContentOfAllContent(): DataType.Content | undefined {
            const t_content = dashboardContextProps?.allContent?.find((v: DataType.Content, i) => {
                if (date) {
                    const v_date = v.date?.slice(0, 10)
                    const t_date = date?.slice(0, 10)
                    return v.element?.name === element.name && v_date === t_date
                }
            })
            return t_content
        }

        //从后端获取
        async function getContentOfDB(date?: string): Promise<DataType.Content | undefined> {
            //
            console.log(108)
            return await fetchContent(date) as DataType.Content | undefined
        }

        //根据模块类型初始化content
        function getInitContent(date?: string) {
            console.log(132)
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
                //时序功能下新建日期所用
                if (date) {
                    initContent.date = date
                } else {
                    initContent.date = ''
                }
            }
            console.log(7999, props.isNested, initContent)
            return initContent
        }

        /* 
            content需要的数据从这里网络请求回来
        */
        const fetchContent = (date?: string) => {
            return new Promise(async (resoleve, reject) => {
                if (eleId) {
                    dashboardContextProps?.fetchElementContent!(eleId, date, props.isNested).then((res) => {
                        resoleve(res)
                    }).catch((res) => { //避免api请求错误，能有初始值
                        resoleve(getInitContent())
                    })
                    //no matter what we receive, wait till if statement end to stop loading
                    setIsLoading(false)
                } else {
                    resoleve(null)
                }
            })
        }

        console.log(137, props.isNested, props.element)
        //listen to props's shouldStartFetch. If it updates, fetchContent

        console.log(139, props.isNested, content, dashboardContextProps)

        //获取模块的时间序列
        const fetchContentDates = async () => {
            if (eleId && props.element.timeSeries) {
                const ele = await props.fetchContentDatesFn(eleId)
                return ele.contents!.map(c => (c.date))
            }
            return []
        }

        useImperativeHandle(ref, () => ({ fetchContent, fetchContentDates }))

        // const updateContent = (ctt: DataType.Content) => {
        //     console.log(155)
        //     if (props.updateContentFn) {
        //         props.updateContentFn(ctt)
        //     }
        // }

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
                    updateContent={props.updateContentFn}
                    onRemove={props.onRemove}
                    editable={props.editable}
                    settable={!!eleId}
                    isLoading={isLoading}
                    setDate={setDate}

                    updateDescription={props.updateDescription}
                    /* 嵌套模块也需要获得content，就通过这个传入的这个函数获得 */
                    //!改
                    fetchContentFn={dashboardContextProps?.fetchElementContent}
                    fetchContentDatesFn={props.fetchContentDatesFn}
                    isNested={props.isNested}
                    addElement={props.addElement}
                />
            </div>
        )
    })

TemplateElement.defaultProps = {
    markAvailable: false,
    timeSeries: false
} as Partial<ContainerElementProps>

