/**
 * Created by Jacob Xie on 11/26/2020
 */

import React, {useRef} from 'react'
import ProForm from "@ant-design/pro-form"

import {BaseForm, BaseFormRef} from "./BaseForm"
import * as DataType from "@/components/Gallery/GalleryDataType"

export interface QuerySelectorFormProps {
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  onSubmit: (value: Record<string, any>) => Promise<any>
}

export const QuerySelectorForm = (props: QuerySelectorFormProps) => {
  const ref = useRef<BaseFormRef>(null)

  const onValuesChange = (value: Record<string, any>) => {
    if (ref.current) ref.current.onValuesChange(value)
  }

  return (
    <ProForm
      name="Query Selector"
      onValuesChange={onValuesChange}
      onFinish={props.onSubmit}
    >
      <BaseForm
        storagesOnFetch={props.storagesOnFetch}
        storageOnSelect={props.storageOnSelect}
        tableOnSelect={props.tableOnSelect}
        ref={ref}
      />
    </ProForm>
  )
}

