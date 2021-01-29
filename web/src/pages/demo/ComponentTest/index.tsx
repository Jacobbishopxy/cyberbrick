/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'

import {Cascader} from "antd"
import {CascaderOptionType, CascaderValueType} from "antd/lib/cascader"


const optionLists = [
  {
    value: 'jacob',
    label: 'Jacob',
    isLeaf: false,
  },
  {
    value: 'sam',
    label: 'Sam',
    isLeaf: false,
  },
]


export default () => {

  const [options, setOptions] = useState(optionLists)

  const onChange = (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => {
    console.log(value, selectedOptions, options)
  }

  const loadData = (selectedOptions?: CascaderOptionType[]) => {
    const targetOption = selectedOptions ? selectedOptions[selectedOptions.length - 1] : []
    targetOption.loading = true

    setTimeout(() => {
      targetOption.loading = false
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ]
      setOptions([...options])
    }, 1000)
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

