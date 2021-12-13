/**
 * Created by Jacob Xie on 11/26/2020
 */

import React, { useRef } from "react"
import { ModalForm } from "@ant-design/pro-form"

import { SelectorAssembledItems, SelectorAssembledItemsRef } from "./SelectorAssembledItems"
import * as DataType from "@/components/Gallery/GalleryDataType"
import { message, Form } from "antd"

export interface QuerySelectorModalProps {
  initialValues?: Record<string, any>
  trigger: React.ReactElement
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  onSubmit: (value: Record<string, any>) => Promise<any> | any
  style?: React.CSSProperties
  columnsRequired?: boolean
  content: DataType.Content | undefined
}

export const QuerySelectorModal = (props: QuerySelectorModalProps) => {
  const ref = useRef<SelectorAssembledItemsRef>(null)
  const [formRef] = Form.useForm()

  const onValuesChange = (value: Record<string, any>) => {
    if (ref.current) ref.current.onValuesChange(value)
  }

  // function onFinish(v): Promise<boolean> {

  //     if (ref.current) {
  //         console.log(3333, ref.current.colValue)
  //         if (ref.current.colValue.length > 0) {
  //             props.onSubmit({
  //                 ...v,
  //                 selects: ref.current.colValue
  //             })
  //             return Promise.resolve(true)
  //         }
  //     }
  //     message.error('请选择列')
  //     return Promise.reject(false)

  // }
  return (
    <ModalForm
      title="Query Selector"
      trigger={props.trigger}
      onValuesChange={onValuesChange}
      onFinish={props.onSubmit}
      modalProps={{ maskClosable: false, keyboard: false, closable: false, destroyOnClose: true }}
      initialValues={props.initialValues}
      style={props.style}
      form={formRef}
    >
      <SelectorAssembledItems
        initialValues={props.initialValues}
        storagesOnFetch={props.storagesOnFetch}
        storageOnSelect={props.storageOnSelect}
        tableOnSelect={props.tableOnSelect}
        columnsRequired={props.columnsRequired}
        ref={ref}
        formRef={formRef}
        content={props.content}
      />
    </ModalForm>
  )
}

