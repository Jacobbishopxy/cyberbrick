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
import moment from "moment"
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
  fetchContentDates: () => Promise<(string | undefined)[]>
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
    const [content, setContent] = useState<DataType.Content | undefined>({ element: props.element })
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
    const [dateList, setDateList] = useState<string[]>([])

    //获取模块的时间序列
    useEffect(() => {
      if (props.timeSeries && props.fetchContentDatesFn && element.id) {
        props.fetchContentDatesFn(element.id).then(res => {
          if (res.contents && res.contents.length > 0) {
            const newDateList = [...new Set(res.contents?.map((v) => v.date.slice(0, 10)).sort((a, b) => (a < b) ? 1 : -1
            ))]
            setDateList(() => {
              return newDateList
            })
            setDate(newDateList[0])
          }
        })
      }
    }, [dashboardContextProps?.edit])

    useEffect(() => console.log(333, props.editable, dateList, props.element.type), [dateList])
    // w为了不每次都繁琐的更改allElement，集中处理
    // useDeepCompareEffectNoCheck(() => {
    //   console.log(84, dateList)
    //   if (props.timeSeries) {
    //     if (props.setElements) {
    //       props.setElements((allElement) => {
    //         return allElement.map((v) => {
    //           if (v.name === props.element.name && v.parentName === props.element.parentName) {

    //             console.log(107, {
    //               ...v,
    //               dateList: dateList
    //             })
    //             return {
    //               ...v,
    //               dateList: dateList
    //             }
    //           } else {
    //             return v
    //           }
    //         })
    //       })
    //     }
    //   }
    // }, [dateList])


    // useDeepCompareEffectNoCheck(() => {
    //   console.log(844, props.element.dateList)
    //   setDateList(props.element.dateList)
    // }, [props.element.dateList])

    //表示当前模块要显示的内容日期，换句话说，没有date就没有内容。
    const [date, setDate] = useState<string | undefined>(undefined)

    // // 如果是时序,初始化date
    // useEffect(() => {

    //   if (props.timeSeries) {
    //     console.log(146, dateList)
    //     if (!date || date === '-1') {
    //       setDate(dateList[0])
    //     }
    //   }
    // }, [dateList])



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

      let t_content: DataType.Content | null

      console.log(81, date, props.isNested)


      t_content = await getContent(date)

      console.log('setContent', props.isNested, t_content, date)
      if (t_content && t_content.date) {
        console.log(208, content, t_content)
        try {
          setContent((content) => {
            return {
              ...content,
              ...t_content
            } as DataType.Content
          })
        } catch (error) {

          setContent(undefined)
          return
        }
      }
    }, [date])

    //从allContent获取；如果没有，DB获取；如果没有，初始化
    async function getContent(date?: string | undefined) {

      // 返回空内容
      if (date === '-1') {
        console.log(205, date)
        setContent((content) => {
          return {
            ...content,
            data: {},
            date: ''
          }
        })
        return null
      }
      const t_date = date ? DataType.today(date) : date
      const t_content = getContentOfAllContent()
      console.log('setContent', props.isNested, t_content, t_date)
      if (t_content) {
        console.log(125, props.isNested, t_content, t_date)
        return t_content
      } else {
        // 只有非时序模块才能不需要date直接获取最新,时序模块必须给出date才能获取
        let t_content
        if (t_date) {
          t_content = await getContentOfDB(t_date)
        } else {
          if (props.timeSeries) {
            t_content = undefined
          } else {
            t_content = await getContentOfDB(t_date)
          }
        }

        console.log('setContent', props.isNested, t_content, t_date)
        if (t_content) {
          return t_content
        } else {
          return getInitContent(t_date)
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
          //! 加一个parentName相同 公司id相同 && 维度id相同 && 模块名字相同 && date相同
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

      return t_content
    }

    //根据模块类型初始化content
    function getInitContent(date?: string) {
      console.log(132, props.element.type, date)
      // if (date) {
      let initContent: DataType.Content;

      switch (props.element.type) {
        case DataType.ElementType.NestedModule:
          //! filter可能不会过滤
          const newTabItems = props.elements?.filter((v, i) => v.isSubmodule && v.parentName == props.element.name)
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

      // 添加相同得字段
      initContent.isEdit = true;

      // 如果是时序
      if (props.timeSeries) {
        //如果是时序,新建content的date为所选择的date
        if (date) {
          initContent.date = date
        } else {
          initContent.date = ''
        }
      }
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
            console.log(337, res)

            // 只有返回有数据时才添加是否编辑得字段
            if (res) {
              resoleve({
                ...res,
                isEdit: false
              })
            }

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
        style={{
          // display: "flex",
          height: '99%'
        }
        }
        ref={mpRef} >
        {/* 这里的判断都是为了submodule能用到nested模块的变量 */}
        <nestedDedicatedContext.Provider value={{
          isNested: props.isNested,
          // setContent: props.isNested
          //     ? NestedDedicatedProps?.setContent
          //     : setContent,
          setContent,
          // content: props.isNested
          //     ? NestedDedicatedProps?.content
          //     : content,
          content,
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
          setElement,
          editable: props.isNested
            ? NestedDedicatedProps?.editable
            : props.editable
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
            date={date ? date.slice(0, 10) : ''}
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

