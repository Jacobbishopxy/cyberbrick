/**
 * Created by Jacob Xie on 11/26/2020
 */

import React, { useEffect, useRef, useState } from "react"
import { ModalForm } from "@ant-design/pro-form"

import { AutoDraftingModalItem, AutoDraftingModalItemRef } from "./AutoDraftingModalItem"
import * as DataType from "@/components/Gallery/GalleryDataType"
import { message, Form } from "antd"

export interface QuerySelectorModalProps {
  initialValues?: Record<string, any>
  trigger?: React.ReactElement
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  onSubmit: (value: Record<string, any>) => Promise<any> | any
  style?: React.CSSProperties
  columnsRequired?: boolean
  content: DataType.Content | undefined
  visibleAutoDrafting: boolean
  setVisibleAutoDrafting: (b: boolean) => void
}

export const AutoDraftingModal = (props: QuerySelectorModalProps) => {
  const ref = useRef<AutoDraftingModalItemRef>(null)
  const [formRef] = Form.useForm()
  const [initialValues, setInitialValues] = useState(props.initialValues)



  const onValuesChange = (value: Record<string, any>) => {
    if (ref.current) ref.current.onValuesChange(value)
  }

  // useEffect(() => {
  //   setInitialValues((v) => {
  //     return {
  //       ...v,
  //       selects: ref.current?.columnSelects
  //     }
  //   })
  // }, [ref.current?.columnSelects])

  // useEffect(() => {
  //   console.log(47, initialValues)
  // }, [initialValues])

  // useEffect(() => {
  //   setInitialValues((v) => {
  //     return {
  //       ...v,
  //       ...props.initialValues
  //     }
  //   })
  // }, [props.initialValues])
  console.log(34, props.initialValues)
  // }
  return (
    <ModalForm
      title="Query Selector"
      onValuesChange={onValuesChange}
      onFinish={props.onSubmit}
      modalProps={{
        maskClosable: false,
        keyboard: false, closable: false,
        destroyOnClose: true,
        onCancel: () => props.setVisibleAutoDrafting(false)
      }}
      initialValues={props.initialValues}
      style={props.style}
      form={formRef}
      visible={props.visibleAutoDrafting}
    >
      <AutoDraftingModalItem
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

