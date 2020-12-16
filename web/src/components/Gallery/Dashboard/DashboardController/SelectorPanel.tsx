/**
 * Created by Jacob Xie on 12/16/2020
 */

import React, {useState} from 'react'
import {Select, Space} from "antd"

import * as DataType from "../../GalleryDataType"


export interface SelectorPanelProps {
  categories: DataType.Category[]
  categoryOnSelect: (name: string) => Promise<DataType.Dashboard[] >
  dashboardOnSelect: (id: string) => void
}

export const SelectorPanel = (props: SelectorPanelProps) => {

  const [dashboards, setDashboards] = useState<DataType.Dashboard[]>([])

  const categoryOnSelect = (name: string) =>
    props.categoryOnSelect(name).then(res => {
      if (res) setDashboards(res)
    })

  return (
    <Space>
      <Select
        style={{width: 120}}
        onSelect={categoryOnSelect}
        size="small"
        placeholder="Category"
      >
        {
          props.categories.map(c =>
            <Select.Option key={c.name} value={c.name}>{c.name}</Select.Option>
          )
        }
      </Select>

      <Select
        style={{width: 120}}
        onSelect={props.dashboardOnSelect}
        size="small"
        placeholder="Dashboard"
      >
        {
          dashboards.map(d =>
            <Select.Option key={d.id} value={d.id!}>{d.name}</Select.Option>
          )
        }
      </Select>
    </Space>
  )
}

