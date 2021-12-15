/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { DatePicker, message, Modal, Skeleton, Button, Form } from "antd"
import { ModalForm } from "@ant-design/pro-form"
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useIntl } from "umi"
import _, { floor } from "lodash"

import * as DataType from "../../GalleryDataType"
import { ConvertFwRef } from "../Generator/data"
import { ModulePanelHeader } from "./ModulePanelHeader"
import { ModulePanelFooter } from "./ModulePanelFooter"
import { collectionSelector } from "../Collections"
import { ModuleSelectorProps } from "../Collections/collectionSelector"

import styles from "./Common.less"
import { IsTemplateContext } from "@/pages/gallery/DashboardTemplate"
import DateBox from "./dateItem"
import { ModuleDescirption } from "./ModuleDescription"
import { TestModuleDescirption } from './testModuleDescription'
// import test from './style'

import { DashboardContext } from "../../Dashboard/DashboardContext"
import { nestedDedicatedContext } from "../../Dashboard/DashboardContainer/nestedDedicatedContext"
export interface ModulePanelProps {
  //公司名字；公司id；维度id
  parentInfo: object
  eleId: string
  elementName: string
  timeSeries?: boolean
  elementType: DataType.ElementType
  description?: string
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  fetchContent: (date?: string) => Promise<any>
  fetchContentDates?: () => Promise<string[]>
  // updateContent: (c: DataType.Content) => void
  onRemove: () => void
  editable: boolean
  settable: boolean
  isLoading: boolean

  date: string
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>



  updateDescription: (ele: string) => void
  fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  isNested?: boolean

  content?: DataType.Content
  setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
  addElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
}

const SKELETON_HEIGHT_TO_ROWS = 50
const SKELETON_DEFAULT_ROWS = 5

// todo: add Tags presenting
// todo: current `ModulePanel` is for `Dashboard`, need one for `Overview`
export const ModulePanel = (props: ModulePanelProps) => {


  const nestedDedicatedProps = useContext(nestedDedicatedContext)
  const intl = useIntl()
  const moduleRef = useRef<React.FC<ModuleSelectorProps>>()
  // 模块的ref，可控制自身的编辑状态
  const moduleFwRef = useRef<ConvertFwRef>(null)
  const [dates, setDates] = useState<string[]>([])

  const [loading, setIsLoading] = useState(props.isLoading)
  const isTemplate = useContext(IsTemplateContext)
  const DashboardProps = useContext(DashboardContext)

  // DatePicker专用
  const [date, setDate] = useState('')
  useEffect(() => {
    setIsLoading(props.isLoading)
  }, [props.isLoading])
  useEffect(() => {
    moduleRef.current = collectionSelector(props.elementType)
  }, [])


  //when dashboard is set to uneditable, make modulePanel unable to edit (by calling moduleFwRef.current.edit(false))
  useEffect(() => {
    if (!props.editable && moduleFwRef.current) moduleFwRef.current.setEdit(props.editable)
  }, [props.editable])

  const confirmDelete = () =>
    Modal.confirm({
      title: intl.formatMessage({ id: "gallery.component.module-panel.panel.module-panel1" }),
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => props.onRemove()
    })

  const updateTitle = (title: string) => {
    const newContent = { ...props.content, title } as DataType.Content
    props.setContent(newContent)
  }

  const footerDate = () => {
    if (props.timeSeries)
      return { date: props.content?.date }
    return {}
  }

  //!可以不要？！
  //设置date
  const headerDate = async (date: string, isMessage?: boolean) => {

    if (props.timeSeries) {
      //如果返回的data为空则提示错误。
      props.fetchContent(date).then((res) => {
        if (Object.keys(res.data).length === 0) {
          message.error('该日期无内容！')
        }
      })
    }
  }



  /* 点击右上角设置或对勾的函数{
      更新模块内容时间；
      !更新父组件的content。
  } */
  const editContent = (b: boolean) => {
    console.log(170, moduleFwRef)
    if (props.editable && moduleFwRef.current) moduleFwRef.current.setEdit(b)
  }

  console.log(191, props.content, props.isNested, props.contentHeight)

  const genHeader = useMemo(() => {
    return <ModulePanelHeader
      editable={props.editable}
      // settable={props.settable}
      timeSeries={props.timeSeries}
      elementName={props.elementName}
      type={props.elementType}
      title={props.content?.title}
      date={props.content?.date}
      updateTitle={updateTitle}
      // 改变自身状态
      editContent={editContent}
      // newContent={newDateWithContent}
      confirmDelete={confirmDelete}
      // dateList={dates}
      editDate={headerDate}
      onSelectDate={props.fetchContent}
      // updateContent={props.updateContent}

      content={props.content}
      setContent={props.setContent}
      setDate={props.setDate}
    />
  }, [props.content?.date, props.editable, props.content])

  //依赖项必须有editable
  const genContext = useMemo(() => {
    const rf = moduleRef.current
    if (rf) {
      //if it's has id (so it's saved to db) and it's loading, display skeleton. 
      //If we finish loading, display whatever content is, including a white board (for content undefined or null)
      if (props.eleId && loading && !props.content) {
        const rows =
          props.contentHeight ? floor(props.contentHeight / SKELETON_HEIGHT_TO_ROWS) : SKELETON_DEFAULT_ROWS
        return <Skeleton className={styles.loadinSkeleton}
          active paragraph={{ rows: rows }} />
      }

      // let h = props.contentHeight ? props.contentHeight - 80 : undefined
      //h=模块高度-标题高度-描述高度
      // let h = props.contentHeight! - parseInt(styles.genHeaderH) - parseInt(styles.genDescriptionH)
      // // h = isTemplate && h ? h - 60 : h
      // h = props.isNested ? props.contentHeight! : h
      // console.log(183, props.isNested, h, props.contentHeight, styles)
      return rf({
        parentInfo: props.parentInfo,
        content: props.content,
        setContent: props.setContent,
        setNewestContent: props.setNewestContent,
        fetchStorages: props.fetchStorages,
        fetchTableList: props.fetchTableList,
        fetchTableColumns: props.fetchTableColumns,
        fetchQueryData: props.fetchQueryData,
        contentHeight: props.contentHeight,
        // updateContent: props.updateContent,
        forwardedRef: moduleFwRef,
        // styling: isTemplate ? styles.templateContentPanel : styles.contentPanel,
        fetchContentFn: props.fetchContentFn,
        fetchContentDatesFn: props.fetchContentDatesFn,
        editable: props.editable,
        initialValue: props.description || '',
        onSave: props.updateDescription,
        addElement: props.addElement
      })
    }
    return <></>
  }, [props.content, props.contentHeight, loading, props.editable])

  const genFooter = useMemo(() =>
    <ModulePanelFooter
      parentInfo={props.parentInfo}
      eleId={props.eleId}
      type={props.elementType}
      id={props.content ? props.content.id : undefined}
      {...footerDate()}
    />, [props.content])

  const attachId = () => props.eleId ? { id: props.eleId } : {}

  const style = () => {
    if (props.elementType === DataType.ElementType.FieldHeader) {
      if (props.editable) return styles.separatorModule
      return styles.separatorModulePresentor
    }
    if (props.isNested && isTemplate) return styles.templateNestedPanel
    if (props.isNested) return styles.nestedModulePanel
    if (isTemplate) return styles.templatePanel
    return styles.modulePanel
  }

  const displayFooter = () => {
    if (props.elementType === DataType.ElementType.FieldHeader) return <></>
    if (isTemplate) return <></>
    if (props.isNested) return <></>
    return genFooter
  }

  function getTabItem() {
    if (props.isNested) {
      if (moduleFwRef && moduleFwRef.current && moduleFwRef.current.items) {
        return moduleFwRef.current.items()
      }
    }
  }

  function getContextStyle() {
    // 仪表盘content样式
    const contentPanelStyle = {
      width: "99%",
      height: props.elementType === DataType.ElementType.Text ? '' : "100%",
      padding: ' 0 5px 0 5px',
      flexGrow: 1
    }
    // 仪表盘nestedContent样式
    const nestedContentPanelStyle = {
      width: "100%",
      height: '100%',
      padding: ' 0 5px 0 5px'
    }
    // 模板content样式
    const templateContentPanel = {
      height: '94%',
      width: '100%',
      padding: '0 5px 0 5px',
      flexGrow: 1
    }

    let finalStyle
    if (isTemplate) {
      finalStyle = templateContentPanel
    } else {
      finalStyle = contentPanelStyle
    }
    if (props.isNested) {
      finalStyle = {
        ...finalStyle,
        ...nestedContentPanelStyle
      }
    }
    console.log(401, finalStyle, props.elementType)
    return finalStyle
  }
  return (
    <div className={`${style()} ${styles.ModulePanel}`} {...attachId()}>
      <div className={styles.genHeader}>
        {genHeader}
      </div>
      <div style={
        !(props.elementType === DataType.ElementType.NestedModule)
          ? {
            display: 'flex',
            flexGrow: 1,
            height: 'calc(100% - 60px)'
          }
          : {
            flexGrow: 1,
            overflow: 'hidden'
          }}>
        <div style={props.timeSeries ? {
          width: '82%',
          overflow: 'auto'
        } : {
          width: '100%',
          height: '100%'
        }}>

          {/* {genDescription} */}

          {/* 根据是模板或仪表盘给予样式 */}
          <div
            // className={
            //   `${isTemplate ? styles.templateContentPanel : styles.contentPanel} ${props.isNested ? styles.genNestedContext : styles.genContext}

            //         `}
            style={getContextStyle()}
          >
            {genContext}

          </div>
        </div>
        {
          props.timeSeries
            ? <div className={styles.dateParent}>
              {

                nestedDedicatedProps?.dateList
                  ? nestedDedicatedProps?.dateList.slice().reverse().map((date) => {
                    return (
                      <DateBox
                        editble={props.editable}
                        date={date}
                        currDate={props.date}
                        setDate={props.setDate}
                        elementName={props.elementName}
                      ></DateBox>
                    )
                  })
                  : <></>
              }
              {
                props.editable
                  ? <ModalForm
                    title='选择日期'
                    trigger={
                      <Button
                        className={styles.dateItem}
                        style={{
                          width: '100%',
                        }}>
                        <PlusOutlined />
                      </Button>}
                    onFinish={() => {
                      props.setDate(date);
                      if (nestedDedicatedProps?.setDateList) {

                        nestedDedicatedProps?.setDateList((dateList) => [...new Set([...dateList, date])].sort((a, b) => (a < b) ? 1 : -1
                        ))
                      }
                      return Promise.resolve(true)
                    }}
                  >
                    <Form.Item
                      label='datePicker'
                      name='datePicker'
                      rules={[{
                        required: true,
                        message: '请选择日期!'
                      }]}
                    >
                      <DatePicker onChange={(e, s) => setDate(s)}></DatePicker>
                    </Form.Item>

                  </ModalForm>
                  : <></>
              }
            </div>
            : <></>
        }
      </div>
      {displayFooter()}
    </div >
  )
}

ModulePanel.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelProps>
