/**
 * Created by Jacob Xie on 1/29/2021
 */

import React, {useEffect, useState} from 'react'
import {Cascader} from "antd"
import {CascaderOptionType, CascaderValueType} from "antd/lib/cascader"

import * as DataType from "../../GalleryDataType"


/**
 * initValue?: holding previous selected value (often used with local storage)
 * categories: list of category, 1st level of select options
 * categoryOnSelect: generate 2nd level of select options
 * dashboardOnSelect?: generate 3rd level of select options
 * onChange?: tell parent component changes are made (often used with local storage)
 * onSelectFinish?: inform parent component the last level of selection
 * style?: style
 * size?: size
 */
export interface SelectorPanelProps {
  initValue?: string[]
  categories: DataType.Category[]
  categoryOnSelect: (name: string) => Promise<DataType.Category>
  dashboardOnSelect?: (id: string) => Promise<DataType.Dashboard>
  onChange?: (value: string[]) => void
  onSelectFinish?: (value: string) => void
  style?: React.CSSProperties
  size?: "large" | "middle" | "small"
}

export const SelectorPanel = (props: SelectorPanelProps) => {

  const [value, setValue] = useState<string[] | undefined>(props.initValue)
  const [options, setOptions] = useState<CascaderOptionType[]>()
  const [selected, setSelected] = useState<string>()

  useEffect(() => setValue(props.initValue), [props.initValue])

  useEffect(() => {
    if (props.onSelectFinish && selected) props.onSelectFinish(selected)
  }, [selected])

  useEffect(() => {
    const opt = props.categories.map(c => ({
      value: c.name,
      label: c.name,
      isLeaf: false
    }))

    enhanceOptions(opt).then(setOptions)

  }, [props.categories])

  const onChange = (value: CascaderValueType) => {
    const v = value as string[]
    setValue(v)
    if (props.onChange) props.onChange(v)
    if (props.onSelectFinish) {
      if (props.dashboardOnSelect)
        setSelected(value[2] as string)
      else
        setSelected(value[1] as string)
    }
  }

  const setOptionsLevel2 = async (cat?: string) => {
    if (cat) {
      const category = await props.categoryOnSelect(cat)
      return category.dashboards?.map(d => ({
        value: d.id,
        label: d.name,
        isLeaf: !props.dashboardOnSelect
      }))
    }
    return []
  }

  const setOptionsLevel3 = async (dsb?: string) => {
    if (dsb) {
      const dashboard = await props.dashboardOnSelect!(dsb)
      return dashboard.templates?.map(t => ({
        value: t.id,
        label: t.name
      }))
    }
    return []
  }

  const enhanceOptions = async (opt: CascaderOptionType[]) => {
    if (value?.length === 2) {
      const v = value ? value[0] : undefined
      const d = await setOptionsLevel2(v)

      return opt.map(i =>
        i.value === v ? {...i, children: d} : i
      )
    } else
      return opt
  }

  const loadData = async (selectedOptions?: CascaderOptionType[]) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      if (selectedOptions.length === 1) {
        const dashboardOptions = await setOptionsLevel2(targetOption.value as string)
        if (dashboardOptions) {
          targetOption.loading = false
          targetOption.children = dashboardOptions
          setOptions([...(options ? options : [])])
        }
      }

      if (selectedOptions.length === 2) {
        const templateOptions = await setOptionsLevel3(targetOption.value as string)
        if (templateOptions) {
          targetOption.loading = false
          targetOption.children = templateOptions
          setOptions([...(options ? options : [])])
        }
      }
    }
  }

  return <Cascader
    value={value}
    options={options}
    loadData={loadData}
    onChange={onChange}
    changeOnSelect
    style={props.style}
    size={props.size || "middle"}
  />
}

