/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Button, FormInstance, SelectProps } from "antd"
import { ProFormSelect } from "@ant-design/pro-form"
import { FormattedMessage } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import { SelectorConditionItems } from "./SelectorConditionItems"
import { SelectorOrderItems } from "./SelectorOrderItems"


type OptionType = SelectProps<any>['options']

export interface AutoDraftingModalItemProps {
  initialValues?: Record<string, any>
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  columnsRequired?: boolean
  formRef: FormInstance<any>
  content: DataType.Content | undefined
}

export interface AutoDraftingModalItemRef {
  onValuesChange: (values: Record<string, any>) => void
  columnSelects: OptionType
}

export const AutoDraftingModalItem =
  forwardRef((props: AutoDraftingModalItemProps, ref: React.Ref<AutoDraftingModalItemRef>) => {

    const [storage, setStorage] = useState<string>(props.initialValues?.id || undefined)
    // const [storages, setStorages] = useState<Record<string, any>[]>()
    const [table, setTable] = useState<string>(props.initialValues?.tableName || undefined)
    // const [cols, setClos] = useState<string[]>(props.initialValues?.selects || undefined)

    const [tableSelects, setTableSelects] = useState<OptionType>()
    const [columnSelects, setColumnSelects] = useState<OptionType>()

    const getStorages = async () => {
      return props.storagesOnFetch()
        .then(res => {
          // setStorages(res)
          return res.map(item => ({ label: item.name, value: item.id }))
        })
    }
    // async function getStorages() {
    //   return await props.storagesOnFetch()

    // }

    const storageOnSelect = (s: string) => props.storageOnSelect(s)
      .then(res => {
        const ans = res.map(item => ({ label: item, value: item }))
        setTableSelects(ans)
      })

    const tableOnSelect = (s: string, t: string) => props.tableOnSelect(s, t)
      .then(res => {
        const ans = res.map(item => ({ label: item, value: item }))
        console.log(53, ans)
        setColumnSelects(ans)
      })

    // s
    useEffect(() => {
      if (storage) storageOnSelect(storage).finally()
    }, [storage])

    useEffect(() => {
      if (storage && table) tableOnSelect(storage!, table!).finally()
    }, [table])


    useEffect(() => {
      console.log(79, props.formRef, columnSelects)
      props.formRef.setFieldsValue({
        selects: columnSelects?.map((v) => v.value).filter((v) => v !== '_id')
      })
    }, [columnSelects])
    // console.log(65)
    // const [colValue, setColValue] = useState<string[] | undefined>([])
    const onValuesChange = (value: Record<string, any>) => {
      if (value.id) setStorage(value.id)
      if (value.tableName) setTable(value.tableName)

    }
    useImperativeHandle(ref, () => ({ onValuesChange, columnSelects }))

    return (
      <>
        {/* 数据库 */}
        <ProFormSelect
          name="id"
          label={<FormattedMessage id="gallery.component.general19" />}
          placeholder="Please select a database"
          rules={[{ required: true, message: 'Please select your database!' }]}
          request={getStorages}
          fieldProps={
            {
              // defaultValue: getStorages().map(())
            }
          }
        />
        {/* 表格 */}
        <ProFormSelect
          name="tableName"
          label={<FormattedMessage id="gallery.component.general36" />}
          placeholder="Please select a table"
          rules={[{ required: true, message: 'Please select your table!' }]}
          options={tableSelects}
        />

        {/* 列 */}
        <div
          style={{
            display: 'none'
          }}>
          <ProFormSelect
            name="selects"
            label={<FormattedMessage id="gallery.component.general33"

            />

            }

            fieldProps={{

              mode: "multiple",
              // 【全选与反选】按钮
              dropdownRender: (menu) => {
                return (
                  <div>
                    {menu}
                    <Button
                      onClick={() => {
                        const allCol = columnSelects?.map((v) => v.value).filter((v) => v !== '_id')
                        const newCol = props.formRef.getFieldValue('selects') && props.formRef.getFieldValue('selects').length === allCol?.length ? [] : allCol
                        console.log(117, allCol, props.formRef.getFieldValue('selects'))

                        props.formRef.setFields([{
                          name: 'selects',
                          value: newCol
                        }])
                      }}
                      type="primary"
                      style={
                        {
                          height: '100%',
                          width: '100%'
                        }
                      }>全选</Button>
                  </div>
                )
              }
            }}
            placeholder="Please select columns"
            // rules={[
            //   {
            //     required: true,
            //     message: '请选择列'
            //   }
            // ]}
            // rules={[{
            //     validator: (r, v) => {
            //         console.log(123, r, v)
            //         if (v && v.length > 0) {
            //             console.log(1233, r, v)

            //             return Promise.resolve()
            //         }
            //         return Promise.reject(new Error('123'));
            //     }
            // }]}
            options={columnSelects}
          />
        </div>

        {/* 条件 */}
        {/* <div
          style={{
            display: 'none'
          }}>
          <SelectorConditionItems
            columnOptions={columnSelects}
          />
        </div>
        {/* 排序 */}
        {/* <SelectorOrderItems
          columnOptions={columnSelects}
        />  */}
      </>
    )
  })

