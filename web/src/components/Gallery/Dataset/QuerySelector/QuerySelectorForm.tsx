/**
 * Created by Jacob Xie on 11/26/2020
 */

import React, {useRef} from 'react'
import ProForm from "@ant-design/pro-form"

import {QueryConditionFormItems, BaseFormItemsRef} from "./QueryConditionFormItems"
import * as DataType from "@/components/Gallery/GalleryDataType"

export interface QuerySelectorFormProps {
  initialValues?: Record<string, any>
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  onSubmit: (value: Record<string, any>) => Promise<any> | any
  style?: React.CSSProperties
  columnsRequired?: boolean
}

export const QuerySelectorForm = (props: QuerySelectorFormProps) => {
  const ref = useRef<BaseFormItemsRef>(null)

  const onValuesChange = (value: Record<string, any>) => {
    if (ref.current) ref.current.onValuesChange(value)
  }

  return (
    <ProForm
      name="Query Selector"
      onValuesChange={onValuesChange}
      onFinish={props.onSubmit}
      initialValues={props.initialValues}
      style={props.style}
    >
      <QueryConditionFormItems
        initialValues={props.initialValues}
        storagesOnFetch={props.storagesOnFetch}
        storageOnSelect={props.storageOnSelect}
        tableOnSelect={props.tableOnSelect}
        columnsRequired={props.columnsRequired}
        ref={ref}
      />
    </ProForm>
  )
}

