/**
 * Created by Jacob Xie on 9/25/2020.
 */

import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Prompt, useHistory } from 'react-router-dom'
import { useIntl, history } from "umi"
// import { createHistory } from 'history'
import { message, Modal } from "antd"
import _ from "lodash"

import * as DataType from "../GalleryDataType"
import { Controller } from "./DashboardController/Controller"
import { Container, ContainerRef } from "./DashboardContainer/Container"
import { IsTemplateContext } from "@/pages/gallery/DashboardTemplate"

import { DashboardContext } from "./DashboardContext"
import IsSavemodal from "./IsSavemodal"
export const EditableContext = React.createContext<boolean>(false)


const dashboardContentUpdate = (contents: DataType.Content[], template: DataType.Template) => {

  const elementNameIdMap = _.chain(template.elements!).keyBy("name").mapValues("id").value()
  const elementNameTypeMap = _.chain(template.elements!).keyBy("name").mapValues("type").value()
  console.log('contents', contents, template, elementNameIdMap, elementNameTypeMap)
  //此处将要传递给后端的内容做调整,注意,这里是all操作.
  return contents.map(c => {
    if (c.element?.id === undefined || c.element!.type === undefined) {
      const element = { ...c.element!, id: elementNameIdMap[c.element!.name], type: elementNameTypeMap[c.element!.name] }
      return { ...c, element }
    }
    return { ...c }
  })
}

//根据content的name和date判断是添加还是修改
const dashboardContentsUpdate = (content: DataType.Content, contents: DataType.Content[] | undefined) => {
  //判断是修改还是增加
  console.log(43, content, contents)
  const date = content?.date?.slice(0, 10)
  const targetContent = _.find(contents, i => {
    const date_s = i.date?.slice(0, 10)
    return i.element?.name === content.element?.name && date_s === date
  })

  let newContents
  //修改只是覆盖，增加是合并
  if (Array.isArray(contents)) {
    if (targetContent) {
      const date = content?.date?.slice(0, 10)
      newContents = contents.map(i => {
        const date_s = i.date?.slice(0, 10)
        return i.element?.name === content.element?.name && date_s === date ? content : i

      })
      console.log(75, newContents)
    }

    else {

      newContents = [...contents, content]
      console.log(75, newContents)
    }
  }
  return newContents
}


export interface DashboardProps {
  // fn: any

  initialSelected?: string[]
  selectedOnChange?: (v: string[]) => void
  fetchCategoriesByType: () => Promise<DataType.Category[]>
  fetchCategories: () => Promise<DataType.Category[]>
  fetchCategory: (categoryName: string) => Promise<DataType.Category>
  fetchDashboard: (dashboardId: string) => Promise<DataType.Dashboard>
  fetchTemplate: (templateId: string, isSubmodule?: boolean) => Promise<DataType.Template>
  saveTemplate: (template: DataType.Template) => Promise<void>
  copyTemplate: (copy: DataType.CopyTemplateElements) => Promise<void>
  fetchElementContent: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchElementContentDates: (id: string, markName?: string) => Promise<DataType.Element>
  updateElementContent: (categoryName: string, type: string, content: DataType.Content) => Promise<void>
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData: (storageId: string, readOption: DataType.Read, databaseType: DataType.StorageType) => Promise<any>
  updateElements: (element: DataType.Element[]) => Promise<any>
  delectContents: (ids: string[]) => Promise<any>

  // initActiveKey: string | undefined
  // setLocalInitActiveKey: React.Dispatch<React.SetStateAction<string>>
}

export const Dashboard = (props: DashboardProps) => {
  const cRef = useRef<ContainerRef>(null)
  const [categoies, setCategories] = useState<DataType.Category[]>([])
  const [dashboardCategories, setDbCategories] = useState<DataType.Category[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>()
  const [selectedDashboard, setSelectedDashboard] = useState<DataType.Dashboard>()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>()
  const [refresh, setRefresh] = useState<number>(0)
  const [canEdit, setCanEdit] = useState<boolean>(true)
  const [edit, setEdit] = useState<boolean>(false)
  const [newestContent, setNewestContent] = useState<DataType.Content>()
  const [updatedContents, setUpdatedContents] = useState<DataType.Content[] | undefined>([])


  const [selected, setSelected] = useState<string[] | undefined>(props.initialSelected?.slice(0, 2))
  useEffect(() => {
    setSelected(props.initialSelected?.slice(0, 2))
  }, [props.initialSelected])

  const [contentIdsToBeDelect, setContentIdsToBeDelect] = useState<string[]>([])

  const intl = useIntl()

  //this is for selecting categories' dashboard. We only need category of corresponding type
  const isTemplate = useContext(IsTemplateContext)
  const dashboardCategoryType = isTemplate ? DataType.CategoryTypeEnum.temp_lib : DataType.CategoryTypeEnum.dashboard

  // const dashboardCategories = categories.filter(ct => ct.type === dashboardCategoryType)

  useEffect(() => {
    props.fetchCategories().then(res => {
      setCategories(res)
      setDbCategories(res.filter(ct => ct?.type === dashboardCategoryType))
    })

  }, [])


  useEffect(() => {
    if (selectedDashboard && cRef.current) cRef.current.startFetchAllContents()
  }, [selectedDashboard])

  //如果content有变化,添加或修改入allContent中
  useEffect(() => {
    if (newestContent) {
      const newContents = dashboardContentsUpdate(newestContent, updatedContents)

      setUpdatedContents(newContents)
    }
  }, [newestContent])

  useEffect(() => {
    console.log(111, updatedContents,)
  }, [updatedContents])

  console.log(4888, props.initialSelected)
  // 维度变化时的执行函数
  useEffect(() => {
    console.log(477, selected, selectedTemplateId)
    if (props.selectedOnChange && selected && selectedTemplateId)
      props.selectedOnChange([...selected, selectedTemplateId])
  }, [selectedTemplateId])

  const categoryOnSelect = async (name: string, isCopy: boolean = false) => {
    if (!isCopy) {
      setSelectedCategoryName(name)
      // setCanEdit(false)
      console.log(137, canEdit, 'categoryOnSelect')
    }
    return await props.fetchCategory(name)
  }

  const dashboardOnSelect = async (dashboardId: string, isCopy: boolean = false) => {
    const dsb = await props.fetchDashboard(dashboardId)
    if (!isCopy) {
      setSelectedDashboard(dsb)
      setCanEdit(true)

      setRefresh(refresh + 1)
    }
    return dsb
  }
  const fetchElements = async (templateId: string) => {
    if (selectedDashboard)
      return props.fetchTemplate(templateId)
    return Promise.reject(new Error("No dashboard selected!"))
  }

  // 循环保存content
  const updateAllContents = async (contents: DataType.Content[]) => {
    console.log(145, contents)
    // todo 点击保存再点退出怎么就不执行了呢
    if (selectedDashboard)
      return Promise.all(
        contents.map(c => {
          if (c.isEdit) {
            props.updateElementContent(selectedDashboard.category!.name, c.element!.type, c)
          }
        })
      )
    return Promise.reject(new Error("No dashboard selected!"))
  }

  const onCopyTemplate = async (originTemplateId: string) => {
    if (selectedDashboard && selectedTemplateId) {
      props.copyTemplate({
        originTemplateId,
        targetTemplateId: selectedTemplateId
      }).then(() => {
        message.success(intl.formatMessage({ id: "gallery.dashboard.copy-template1" }))
        if (cRef.current) cRef.current.startFetchElements()
      })
    } else
      message.warn(intl.formatMessage({ id: "gallery.dashboard.copy-template2" }))
  }

  // 删除contents
  function delectContents(ids: string[]) {
    console.log(207, ids)
    if (ids && ids.length > 0) {

      props.delectContents(ids)
    }

  }
  useEffect(() => console.log(444, contentIdsToBeDelect))

  const onRefresh = async (shouldSaveTemplateAndContents: boolean) => {

    // 删除contents
    await delectContents(contentIdsToBeDelect)

    if (cRef.current) {
      if (shouldSaveTemplateAndContents) {
        // 获得template和elements数据
        const t = cRef.current.getTemplate()
        if (t) {

          // 向后端保存template和elements数据
          await props.saveTemplate(t)
          console.log(217, updatedContents)
          if (updatedContents && updatedContents.length > 0) {
            // 向后端获取template和elements数据
            const updatedTemplate = await props.fetchTemplate(t.id!)
            const contents = dashboardContentUpdate(updatedContents, updatedTemplate)
            console.log('contents', contents)
            // 循环保存content
            await updateAllContents(contents)
            console.log(230)


            // 清空
            setNewestContent(undefined)
            setUpdatedContents([])
          }
        }

      }
      cRef.current.fetchTemplate()
      setRefresh(refresh + 1)
      return Promise.resolve()
    }
    return Promise.reject(new Error("Invalid template!"))
  }

  const fetchElementContent = async (id: string, date?: string, isNested?: boolean) => {
    /**if the element is nested inside NestedSimpleModule, it doesn't belong to an element. Rather, it's part
     * of the tabItem. So we only fetch the content from database
    */
    if (isNested) return fetchNestedElementContent(id, date)
    const content = await props.fetchElementContent(id, date, isNested)
    return content
  }

  const fetchNestedElementContent = async (id: string, date?: string) => {
    const content = await props.fetchElementContent(id, date, true)
    return content as unknown as DataType.Content
  }

  const fetchElementContentDates = async (id: string) =>
    props.fetchElementContentDates(id)

  //嵌套模块专用：更新contents，在这里加入dashboard信息
  const setDashboardInfoInNewestContent = (content: DataType.Content) => {
    setNewestContent(() => {
      const category = {
        name: selectedDashboard?.category?.name
      } as DataType.Category
      return {
        ...content,
        category
      } as DataType.Content
    })
  }

  const fetchQueryData = async (value: DataType.Content) => {
    // if (!value?.data) return Promise.resolve(undefined)
    const id = value.data?.id
    const option = value.data as DataType.Read
    //default to pg
    const dbType = value.storageType ? value.storageType : DataType.StorageType.PG
    if (id && option)
      return props.fetchQueryData(id, option, dbType)
    return Promise.reject(new Error("content data is inappropriate!"))
  }

  const onAddModule = (n: string, ts: boolean, et: DataType.ElementType) => {
    console.log(220, n, ts, et)
    if (cRef.current) cRef.current.newElement(n, ts, et)
  }

  // props.fetchElementContentDates('5cacdb29-8b79-41d1-ad0a-97781944cfa7').then((res) => {
  //     console.log(271, res)
  // })
  const genController = useMemo(() => <Controller
    initialSelected={props.initialSelected}
    canEdit={canEdit}
    categoriesAllType={categoies}
    dashboardCategories={dashboardCategories}
    categoryOnSelect={categoryOnSelect}
    dashboardOnSelect={dashboardOnSelect}
    onSelectChange={setSelected}
    onAddModule={onAddModule}
    onCopyTemplate={onCopyTemplate}
    edit={edit}
    setEdit={setEdit}
    onSaveTemplate={onRefresh}
  // ContainerRef={cRef}
  />, [canEdit, dashboardCategories, onRefresh, edit])

  const genContainer = useMemo(() => selectedDashboard ?
    <Container
      selectedCategoryName={selectedCategoryName!}
      dashboardInfo={selectedDashboard}
      initialSelected={props.initialSelected}
      onSelectPane={setSelectedTemplateId}
      fetchElements={fetchElements}
      // fetchElementContentFn={fetchElementContent}
      fetchElementContentDatesFn={fetchElementContentDates}
      setNewestContent={setNewestContent}
      fetchStoragesFn={props.fetchStorages}
      fetchTableListFn={props.fetchTableList}
      fetchTableColumnsFn={props.fetchTableColumns}
      fetchQueryDataFn={fetchQueryData}

      ref={cRef}
    /> : <>{intl.formatMessage({ id: "gallery.component.dashboard-container1" })}</>, [refresh])


  // const [isvisible, setIsvisible] = useState(false)
  // if未保存，提醒用户
  // const h = useHistory()

  // const history = createHistory({
  // getUserConfirmation(message, callback) {
  // 向用户显示一些自定义对话框并调用
  // callback(true) 以继续转换，或
  // callback(false) 以中止它。
  // }
  // });
  useEffect(() => {
    function IsSave(e: BeforeUnloadEvent) {
      e.preventDefault()
      // Modal.confirm({
      //     title: "234"
      // })
      //         // e.preventDefault();
      e.returnValue = '当前未保存，所编辑的数据将不可恢复，是否离开？'
    }
    if (edit) {
      window.addEventListener('beforeunload', IsSave)
    }
    return () => {
      window.removeEventListener('beforeunload', IsSave)
    }
  })
  // let unListen: Function
  // if (edit) {
  //     // window.addEventListener('popstate', (e) => {
  //     //     console.log(345, e)
  //     // })
  //     // if (!unListen) {

  //     unListen = h.listen((location, action) => {
  //         console.log(340, h, location, action)
  //         setIsvisible(true)
  //     })
  //     // }
  // }
  //     return () => {
  //         console.log(353, unListen)
  //         unListen && unListen()
  //     }
  // }, [edit])


  return (

    <DashboardContext.Provider value={{
      fetchElementContent,
      saveTemplate: props.saveTemplate,
      updateElements: props.updateElements, setDashboardInfoInNewestContent,
      allContent: updatedContents,
      setAllContent: setUpdatedContents,
      edit,
      setEdit,
      ContainerRef: cRef,

      contentIdsToBeDelect,
      setContentIdsToBeDelect
      // getTemplateElements: fetchElements
    }}>
      {/* <Modal visible={isvisible} onCancel={() => setIsvisible(false)} ></Modal> */}
      <Prompt
        when={edit}
        message={'当前未保存，所编辑的数据将不可恢复，是否离开？'}
      ></Prompt>
      {genController}
      {genContainer}
    </DashboardContext.Provider>
  )
}

