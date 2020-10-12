/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons'
import _ from "lodash"

import * as DataType from "../../GalleryDataType"
import { ConvertRefFR } from "../Generator/data"
import { ModulePanelHeader } from "./ModulePanelHeader"
import { ModulePanelFooter } from "./ModulePanelFooter"
import { collectionSelector } from "../Collections"

import styles from "./Common.less"


export interface ModulePanelProps {
  headName: string
  timeSeries?: boolean
  elementType: DataType.ElementType
  content?: DataType.Content
  fetchContent: (date?: string) => void
  dates?: string[]
  fetchContentDates?: () => void
  updateContent: (c: DataType.Content) => void
  onRemove: () => void
  editable: boolean
}

export const ModulePanel = (props: ModulePanelProps) => {

  const moduleRef = useRef<ConvertRefFR>(null)
  const selectedModule = collectionSelector(props.elementType)

  const [editOn, setEditOn] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [dateList, setDateList] = useState<string[] | undefined>(props.dates)

  useEffect(() => setContent(props.content), [props.content])

  useEffect(() => setDateList(props.dates), [props.dates])

  useEffect(() => {
    if (props.timeSeries && props.fetchContentDates && content && !props.editable)
      props.fetchContentDates()
  }, [content])


  const editContent = () => {
    if (props.editable) {
      setEditOn(!editOn)
      if (moduleRef.current) moduleRef.current.edit()
    }
  }

  const confirmDelete = () =>
    Modal.confirm({
      title: 'Delete this module?',
      icon: <ExclamationCircleOutlined/>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => props.onRemove()
    })

  const updateTitle = (title: string) => {
    const newContent = content ?
      { ...content, title } :
      { title, data: {}, date: DataType.today() }
    setContent(newContent)
    props.updateContent(newContent)
  }

  const footerDate = () => {
    if (props.timeSeries && props.content)
      return { date: props.content.date }
    return {}
  }

  const headerDate = (date: string) => {
    if (props.timeSeries) {
      const newContent = content ?
        { ...content, date } :
        { date, data: {} } as DataType.Content
      setContent(newContent)
      props.updateContent(newContent)
    }
  }

  const updateModuleContent = (ctt: DataType.Content) => {
    const newContent = { ...content, ...ctt }
    setContent(newContent)
    props.updateContent(newContent)
  }

  const newDateWithContent = (d: string) => {
    const prevContentWithoutId = _.omit(content, "id")
    const newContent = {
      ...prevContentWithoutId,
      date: d
    } as DataType.Content
    setContent(newContent)
    props.updateContent(newContent)
  }

  const selectDate = (date: string) => {
    setContent(undefined)
    props.fetchContent(date)
  }

  return (
    <div className={ styles.modulePanel }>
      <ModulePanelHeader
        editable={ props.editable }
        timeSeries={ props.timeSeries }
        headName={ props.headName }
        title={ props.content ? props.content.title : undefined }
        updateTitle={ updateTitle }
        editOn={ editOn }
        editContent={ editContent }
        newContent={ newDateWithContent }
        confirmDelete={ confirmDelete }
        dateList={ dateList }
        editDate={ headerDate }
        onSelectDate={ selectDate }
      />
      {
        selectedModule({
          content,
          updateContent: updateModuleContent,
          forwardedRef: moduleRef
        })
      }
      <ModulePanelFooter
        id={ props.content ? props.content.id : undefined }
        { ...footerDate() }
      />
    </div>
  )
}

ModulePanel.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelProps>
