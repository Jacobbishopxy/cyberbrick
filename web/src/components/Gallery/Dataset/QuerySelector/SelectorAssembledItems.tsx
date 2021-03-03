/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react"
import {SelectProps} from "antd"
import {ProFormSelect} from "@ant-design/pro-form"
import {FormattedMessage} from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import {SelectorConditionItems} from "./SelectorConditionItems"


type OptionType = SelectProps<any>['options']

export interface SelectorAssembledItemsProps {
  initialValues?: Record<string, any>
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  columnsRequired?: boolean
}

export interface SelectorAssembledItemsRef {
  onValuesChange: (values: Record<string, any>) => void
}

export const SelectorAssembledItems =
  forwardRef((props: SelectorAssembledItemsProps, ref: React.Ref<SelectorAssembledItemsRef>) => {

    const [storage, setStorage] = useState<string>(props.initialValues?.id || undefined)
    const [table, setTable] = useState<string>(props.initialValues?.tableName || undefined)

    const [tableSelects, setTableSelects] = useState<OptionType>()
    const [columnSelects, setColumnSelects] = useState<OptionType>()

    const getStorages = async () => props.storagesOnFetch()
      .then(res => res.map(item => ({label: item.name, value: item.id})))

    const storageOnSelect = (s: string) => props.storageOnSelect(s)
      .then(res => {
        const ans = res.map(item => ({label: item, value: item}))
        setTableSelects(ans)
      })

    const tableOnSelect = (s: string, t: string) => props.tableOnSelect(s, t)
      .then(res => {
        const ans = res.map(item => ({label: item, value: item}))
        setColumnSelects(ans)
      })

    useEffect(() => {
      if (storage) storageOnSelect(storage).finally()
    }, [storage])

    useEffect(() => {
      if (storage && table) tableOnSelect(storage!, table!).finally()
    }, [table])

    const onValuesChange = (value: Record<string, any>) => {
      if (value.id) setStorage(value.id)
      if (value.tableName) setTable(value.tableName)
    }
    useImperativeHandle(ref, () => ({onValuesChange}))

    return (
      <>
        <ProFormSelect
          name="id"
          label={<FormattedMessage id="gallery.component.general19" />}
          placeholder="Please select a database"
          rules={[{required: true, message: 'Please select your database!'}]}
          request={getStorages}
        />

        <ProFormSelect
          name="tableName"
          label={<FormattedMessage id="gallery.component.general36" />}
          placeholder="Please select a table"
          rules={[{required: true, message: 'Please select your table!'}]}
          options={tableSelects}
        />

        <ProFormSelect
          name="selects"
          label={<FormattedMessage id="gallery.component.general33" />}
          fieldProps={{mode: "multiple"}}
          placeholder="Please select columns"
          rules={props.columnsRequired === true ? [{required: true, message: 'Please select your columns!'}] : []}
          options={columnSelects}
        />

        <SelectorConditionItems
          columnOptions={columnSelects}
        />
      </>
    )
  })

