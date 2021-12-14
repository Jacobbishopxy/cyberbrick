/**
 * Created by Jacob Xie on 11/19/2020
 */

import { useState } from 'react'
import { Divider, Form, Input, Radio, Select } from "antd"
import { FormattedMessage } from "umi"

import { BaseModal } from "./BaseModal"


export interface IdType {
  name: string
  id: string
}

export interface FileInsertModalProps {
  idList: IdType[]
  setVisible: (value: boolean) => void
  visible: boolean
  uploadAddress?: String
  upload: (option: Record<string, any>, data: any) => Promise<any>
  uploadResHandle?: (value: any) => void
  databaseName?: string
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
      initialValues={{ insertOption: "replace", id: props.databaseName }}
      setVisible={props.setVisible}
      visible={props.visible}
      beforeUpload={beforeUpload}
      uploadAddress={props.uploadAddress}
      upload={props.upload}
      uploadResHandle={props.uploadResHandle}
    >
      <Divider plain orientation="left" style={{ color: "lightgray" }}>
        <FormattedMessage id="component.fileUploadModal.fileInsertModal.databaseOptions" />
      </Divider>

      <Form.Item
        name="id"
        rules={[{ required: true, message: '请选择要上传至的数据库' }]}
        label={<FormattedMessage id="component.fileUploadModal.fileInsertModal.databaseOptions" />}
      >
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
            label={<FormattedMessage id="component.fileUploadModal.fileInsertModal.tableName" />}
            rules={[{ required: true, message: "File is required" }]}
          >
            <Input placeholder="Table name" />
          </Form.Item> : <></>
      }

      <Form.Item
        name="insertOption"
        label={<FormattedMessage id="component.fileUploadModal.fileInsertModal.insertOption" />}
      >
        <Radio.Group>
          <Radio value="replace">
            <FormattedMessage id="component.fileUploadModal.fileInsertModal.replace" />
          </Radio>
          <Radio value="append">
            <FormattedMessage id="component.fileUploadModal.fileInsertModal.append" />
          </Radio>
          <Radio value="fail">
            <FormattedMessage id="component.fileUploadModal.fileInsertModal.fail" />
          </Radio>
        </Radio.Group>
      </Form.Item>
    </BaseModal>
  )
}

