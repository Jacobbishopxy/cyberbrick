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
  type: DataType.ElementType
  id?: string
  date?: string
}

export const ModulePanelFooter = (props: ModulePanelFooterProps) => {

  const [viewId, setViewId] = useState<boolean>(false)

  const showIdAndType = () =>
    <Space>
      <IdViewer onClick={setViewId}/>
      {
        viewId ?
          <Space>
            <span>Type: {props.type}</span>
            <span>ID: {props.id}</span>
          </Space> : <></>
      }
    </Space>

  return (
    <div className={styles.modulePanelFooter}>
      {props.id ? showIdAndType() : <></>}
      {props.date ? <span>Date: {DataType.timeToString(props.date)}</span> : <></>}
    </div>
  )
}

