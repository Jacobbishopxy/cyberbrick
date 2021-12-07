/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useContext } from "react"

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"

import { DashboardContext } from "../DashboardContext"
import { nestedDedicatedContext } from './nestedDedicatedContext'
import { message } from "antd"
import _ from 'lodash'
import e from "@umijs/deps/compiled/express"
import { await } from "signale"
import { number } from "yargs"
import useDeepCompareEffect, { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
export interface ContainerElementProps {
    parentInfo: {
        selectedCategoryName: string,
        dashboardInfo: DataType.Dashboard
        templateInfo: DataType.Template
    } | undefined
    timeSeries?: boolean
    editable?: boolean
    element: DataType.Element
    shouldStartFetch: number
    isNested?: boolean
    fetchContentFn?: (id: string | undefined, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
    setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
    onRemove?: () => void
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
    updateDescription: (ele: string) => void
    addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType, isNested?: boolean) => boolean
    // onTEfetchContent: (element.id: string, elementType: DataType.ElementType, date?: string | undefined) => Promise<DataType.Content | undefined>

    //该维度下的全部elements
    elements?: DataType.Element[]
    //更改全局elements
    setElements: React.Dispatch<React.SetStateAction<DataType.Element[]>> | undefined
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

        //nestedmodule专用变量
        const dashboardContextProps = useContext(DashboardContext)
        const NestedDedicatedProps = useContext(nestedDedicatedContext)
        //模块主体部分：各类型模块的引用
        const mpRef = useRef<HTMLDivElement>(null)

        const [mpHeight, setMpHeight] = useState<number>(0)
        //模块内容的源
        const [content, setContent] = useState<DataType.Content>()
        //
        const [element, setElement] = useState(props.element)
        // useEffect(() => {
        //     setElement(props.element)
        // }, [props.element])

        // nested模块专用
        const [currentModuleName, setCurrentModuleName] = useState('')

        const [isLoading, setIsLoading] = useState(true);

        useLayoutEffect(() => {
            if (mpRef.current) {
                setMpHeight(mpRef.current.offsetHeight)
                console.log(82, props.isNested, mpRef.current.offsetHeight)
            }
        })

        //该模块的时间序列
        const [dateList, setDateList] = useState<string[] | undefined>(props.element.dateList)

        //获取模块的时间序列
        useEffect(() => {
            if (props.timeSeries && props.fetchContentDatesFn && element.id) {
                props.fetchContentDatesFn(element.id).then(res => {
                    console.log(8444, res)
                    if (res.contents && res.contents.length > 0) {

                        setDateList(() => {
                            return res.contents?.map((v) => v.date.slice(0, 10)).sort((a, b) => (a < b) ? 1 : -1
                            )
                        })
                    }
                })
            }
        }, [props.editable])

        // w为了不每次都繁琐的更改allElement，集中处理
        useDeepCompareEffectNoCheck(() => {
            console.log(84, dateList)
            if (props.timeSeries) {
                if (props.setElements) {
                    props.setElements((allElement) => {
                        return allElement.map((v) => {
                            if (v.name === props.element.name && v.parentName === props.element.parentName) {

                                console.log(107, {
                                    ...v,
                                    dateList: dateList
                                })
                                return {
                                    ...v,
                                    dateList: dateList
                                }
                            } else {
                                return v
                            }
                        })
                    })
                }
            }
        }, [dateList])

        useDeepCompareEffectNoCheck(() => {
            console.log(844, props.element.dateList)
            setDateList(props.element.dateList)
        }, [props.element.dateList])

        //表示当前模块要显示的内容日期，换句话说，没有date就没有内容。
        const [date, setDate] = useState<string>(getDate())





        //submodule专用：如果有时序功能，获取最新时序。
        function getDate() {
            if (props.isNested && props.timeSeries) {
                console.log(99, props.isNested, props.timeSeries)
                // const currIndex = NestedDedicatedProps?.content?.data?.currIndex;
                // setDate(() => NestedDedicatedProps?.content?.data?.tabItems[currIndex].dateList[0])
                if (dateList) {

                    return dateList[0]
                }

            }
            return ''

        }



        //每当content改变后都存入allContent数组。最终调用的saveContent会判断是否修改与增加。
        //写在此文件中集中处理
        useEffect(() => {
            console.log(152, content, props.isNested)

            if (content && content.date) {
                setDate(() => content.date)
                if (props.setNewestContent) {
                    props.setNewestContent(content)
                }
            }
        }, [content])

        //获取content内容，依赖项是
        useEffect(async () => {

            let t_content

            console.log(81, date, props.isNested)
            if (date) {
                let t_date = DataType.today(date)
                t_content = await getContent(t_date)
            } else {
                t_content = await getContent()
            }
            console.log('setContent', props.isNested, t_content, date)
            if (t_content && t_content.date) {

                try {
                    setContent(t_content)
                } catch (error) {
                    console.log(208, error)
                    setContent(undefined)
                    return
                }
            }
        }, [date])

        //从allContent获取；如果没有，DB获取；如果没有，初始化
        async function getContent(date?: string) {
            const t_content = getContentOfAllContent()
            console.log('setContent', props.isNested, t_content, date)
            if (t_content) {
                console.log(125, props.isNested, t_content, date)
                return t_content
            } else {
                const t_content = await getContentOfDB(date)
                console.log('setContent', props.isNested, t_content, date)
                if (t_content) {
                    return t_content
                } else {
                    return getInitContent(date)
                }
            }
        }

        // 从allContent查找数据，条件是name和date，有返回true，没有返回false
        function getContentOfAllContent(): DataType.Content | undefined {
            console.log(118, date)
            let t_content
            if (date) {
                console.log(135, props.isNested, dashboardContextProps?.allContent, props.parentInfo)
                t_content = dashboardContextProps?.allContent?.find((v: DataType.Content, i) => {
                    const v_date = v.date?.slice(0, 10)
                    const t_date = date?.slice(0, 10)
                    return v.element?.name === element.name
                        && v_date === t_date
                        && v.dashboardInfo?.id === props?.parentInfo?.dashboardInfo.id
                        && v.templateInfo?.id === props?.parentInfo?.templateInfo.id
                })
            }
            return t_content
        }

        //从后端获取
        async function getContentOfDB(date?: string): Promise<DataType.Content | undefined> {
            //
            const t_content = await fetchContent(date) as DataType.Content | undefined
            console.log(108, t_content)
            //nested模块的tabItems需要通过elements获得id字段
            // if (props.element.type === DataType.ElementType.NestedModule) {
            //     if (t_content?.data) {
            //         t_content.data.tabItems = t_content?.data?.tabItems.map((item) => {
            //             if (item.name) {
            //                 return {
            //                     ...item,
            //                     id: props.elements?.find((el) => item.name === el.name)?.id
            //                 }
            //             } else {
            //                 return item
            //             }
            //         })
            //     }
            // }

            console.log(108, t_content)
            return t_content
        }

        //根据模块类型初始化content
        function getInitContent(date?: string) {
            console.log(132, props.element.type)
            // if (date) {
            let initContent: DataType.Content;

            switch (props.element.type) {
                case DataType.ElementType.NestedModule:
                    const newTabItems = props.elements?.filter((v, i) => v.isSubmodule && v.parentName === props.element.name)
                    console.log(285, newTabItems)
                    initContent = {
                        data: {
                            // currIndex: -1,
                            tabItems: newTabItems && newTabItems.length > 0 ? newTabItems : []
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
                    break;
                case DataType.ElementType.Line:
                    initContent = {
                        data: {},
                        config: {},
                        date: DataType.today()
                    }
                    break;
                case DataType.ElementType.ConsensusDistribution:
                    initContent = {
                        data: {
                            minPrice: "最低价",
                            topPrice: "最高价",
                            medianPrice: "中位价",
                            targetPrice: "期望价"
                        },
                        date: DataType.today(),
                    }
                    break
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
            console.log(333, props.isNested, initContent, date)
            console.log('setContent', props.isNested, initContent, date)
            return initContent
            // }
        }

        /* 
            content需要的数据从这里网络请求回来
        */
        const fetchContent = (date?: string) => {
            return new Promise(async (resoleve, reject) => {
                console.log(230, props.isNested, element)
                if (element.id) {
                    dashboardContextProps?.fetchElementContent!(element.id, date, props.isNested).then((res) => {
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

        console.log(137, props.isNested, props.editable, props)
        //listen to props's shouldStartFetch. If it updates, fetchContent


        // 获取模块的时间序列
        const fetchContentDates = async () => {
            if (element.id && props.element.timeSeries) {
                const ele = await props.fetchContentDatesFn(element.id)
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
                {/* 这里的判断都是为了submodule能用到nested模块的变量 */}
                <nestedDedicatedContext.Provider value={{
                    isNested: props.isNested,
                    setContent: props.isNested
                        ? NestedDedicatedProps?.setContent
                        : setContent,
                    content: props.isNested
                        ? NestedDedicatedProps?.content
                        : content,
                    parentInfo: props.isNested
                        ? NestedDedicatedProps?.parentInfo
                        : props.parentInfo,
                    elements: props.isNested
                        ? NestedDedicatedProps?.elements
                        : props.elements,
                    setElements: props.isNested
                        ? NestedDedicatedProps?.setElements
                        : props.setElements,
                    dateList,
                    setDateList,
                    // setDateList,
                    //模块的名字
                    elementName: props.element.name,
                    // nested模块专用
                    currentModuleName: props.isNested
                        ? NestedDedicatedProps?.currentModuleName
                        : currentModuleName,
                    setCurrentModuleName: props.isNested
                        ? NestedDedicatedProps?.setCurrentModuleName
                        : setCurrentModuleName,
                    element,
                    setElement
                }}>
                    <ModulePanel
                        parentInfo={props.parentInfo}
                        eleId={element.id}
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
                        // updateContent={props.updateContentFn}
                        setNewestContent={props.setNewestContent}
                        onRemove={props.onRemove}
                        // 右上角的编辑
                        editable={props.editable}
                        settable={!!element.id}
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
                </nestedDedicatedContext.Provider>

            </div >
        )
    })

TemplateElement.defaultProps = {
    markAvailable: false,
    timeSeries: false
} as Partial<ContainerElementProps>

