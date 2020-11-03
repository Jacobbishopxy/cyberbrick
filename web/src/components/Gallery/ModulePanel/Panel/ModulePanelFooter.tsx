/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, {useState} from 'react'
import {Space} from "antd"
import {MinusOutlined, PlusOutlined} from '@ant-design/icons'

import * as DataType from "@/components/Gallery/GalleryDataType"

import {Editor} from "@/components/Editor"
import styles from "./Common.less"


const IdViewer = (props: { onClick: (value: boolean) => void }) =>
  <Editor
    icons={{open: <PlusOutlined/>, close: <MinusOutlined/>}}
    onChange={props.onClick}
  />

export interface ModulePanelFooterProps {
  id?: string
  date?: string
}

export const ModulePanelFooter = (props: ModulePanelFooterProps) => {

  const [viewId, setViewId] = useState<boolean>(false)

  const showId = () =>
    <Space>
      <IdViewer onClick={setViewId}/>
      {viewId ? <>ID: {props.id}</> : <></>}
    </Space>

  return (
    <div className={styles.modulePanelFooter}>
      {props.id ? showId() : <></>}
      {props.date ? <span>Date: {DataType.timeToString(props.date)}</span> : <></>}
    </div>
  )
}

