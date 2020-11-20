/**
 * Created by Jacob Xie on 11/17/2020
 */

import React from 'react'
import {Select, Space} from "antd"
import {SaveTwoTone, SettingTwoTone} from "@ant-design/icons"

import {Editor} from "@/components/Editor"
import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"


export interface ControllerProps {
  storages: DataType.StorageSimple[]
  storageOnSelect: (id: string) => void
  onEdit: (value: boolean) => void
}

export const Controller = (props: ControllerProps) => {

  return (
    <SpaceBetween>
      <Space>
        <Select
          style={{width: 200}}
          onSelect={props.storageOnSelect}
          size="small"
          placeholder="Database"
        >
          {
            props.storages.map(s =>
              <Select.Option key={s.id} value={s.id}>
                <Space>
                  <span>Name: {s.name}</span>
                  <span>Description: {s.description}</span>
                </Space>
              </Select.Option>
            )
          }
        </Select>
      </Space>

      <div>
        <Editor
          icons={{
            open: <SettingTwoTone style={{fontSize: 20}}/>,
            close: <SaveTwoTone style={{fontSize: 20}}/>
          }}
          onChange={props.onEdit}
        />
      </div>
    </SpaceBetween>
  )
}

