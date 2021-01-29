/**
 * Created by Jacob Xie on 1/29/2021
 */

import React, {useEffect, useState} from 'react'
import {Cascader} from "antd"
import {CascaderOptionType, CascaderValueType} from "antd/lib/cascader"


import * as DataType from "../../GalleryDataType"

export interface SelectorPanelProProps {
  categories: DataType.Category[]
  categoryOnSelect: (name: string) => Promise<DataType.Category>
  dashboardOnSelect?: (id: string) => Promise<DataType.Dashboard>
  onChange: (value: string[]) => void
}

export const SelectorPanelPro = (props: SelectorPanelProProps) => {

  const [options, setOptions] = useState<CascaderOptionType[]>([])

  useEffect(() => {
    setOptions(props.categories.map(c => ({
      value: c.name,
      label: c.name,
      isLeaf: false
    })))
  }, [props.categories])

  const onChange = (value: CascaderValueType) =>
    props.onChange(value as string[])

  const loadData = async (selectedOptions?: CascaderOptionType[]) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      if (selectedOptions.length === 1) {
        const category = await props.categoryOnSelect(targetOption.value as string)

        const dashboardOptions = category.dashboards?.map(d => ({
          value: d.id,
          label: d.name,
          isLeaf: !props.dashboardOnSelect
        }))

        if (dashboardOptions) {
          targetOption.loading = false
          targetOption.children = dashboardOptions
          setOptions([...options])
        }
      }

      if (selectedOptions.length === 2) {
        const dashboard = await props.dashboardOnSelect!(targetOption.value as string)

        const templateOptions = dashboard.templates?.map(t => ({
          value: t.id,
          label: t.name
        }))

        if (templateOptions) {
          targetOption.loading = false
          targetOption.children = templateOptions
          setOptions([...options])
        }
      }
    }
  }

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={onChange}
      changeOnSelect
    />
  )
}

