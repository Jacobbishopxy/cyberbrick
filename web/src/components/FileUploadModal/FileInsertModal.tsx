/**
 * Created by Jacob Xie on 11/19/2020
 */

import React, {useState} from 'react'
import {Divider, Form, Input, Radio, Select} from "antd"

import {BaseModal} from "./BaseModal"


export interface IdType {
  name: string
  id: string
}

export interface FileInsertModalProps {
  idList: IdType[]
  setVisible: (value: boolean) => void
  visible: boolean
  upload: (option: Record<string, any>, data: any) => Promise<any>
  uploadResHandle?: (value: any) => void
}

export const FileInsertModal = (props: FileInsertModalProps) => {

  const [isCsv, setIsCsv] = useState<boolean>(false)

  const beforeUpload = (file: File) => {
    if (file.type === "application/vnd.ms-excel")
      setIsCsv(true)
    else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      setIsCsv(false)
    else {
      return false
    }
    return true
  }

  return (
    <BaseModal
      initialValues={{insertOption: "replace"}}
      setVisible={props.setVisible}
      visible={props.visible}
      beforeUpload={beforeUpload}
      upload={props.upload}
      uploadResHandle={props.uploadResHandle}
    >
      <Divider plain orientation="left" style={{color: "lightgray"}}>Database options</Divider>

      <Form.Item name="id" label="Database">
        <Select>
          {
            props.idList.map(i => (
              <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>

      {
        isCsv ?
          <Form.Item
            name="tableName"
            label="Table name"
            rules={[{required: true, message: "File is required"}]}
          >
            <Input placeholder="Table name"/>
          </Form.Item> : <></>
      }

      <Form.Item name="insertOption" label="Insert option">
        <Radio.Group>
          <Radio value="replace">
            Replace
          </Radio>
          <Radio value="append">
            Append
          </Radio>
          <Radio value="fail">
            Fail
          </Radio>
        </Radio.Group>
      </Form.Item>
    </BaseModal>
  )
}

