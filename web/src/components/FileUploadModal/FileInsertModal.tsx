/**
 * Created by Jacob Xie on 11/19/2020
 */

import React from 'react'
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
  uploadResHandle: (value: any) => void
}

export const FileInsertModal = (props: FileInsertModalProps) => {

  return (
    <BaseModal
      setVisible={props.setVisible}
      visible={props.visible}
      upload={props.upload}
      uploadResHandle={props.uploadResHandle}
    >
      <>
        <Divider plain orientation="left" style={{color: "lightgray"}}>Database options</Divider>

        <Form.Item name="id" label="Database">
          <Select>
            {
              props.idList.map(i => (
                <Select.Option value={i.id}>{i.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item name="tableName" label="Table name">
          <Input placeholder="Table name"/>
        </Form.Item>

        <Divider plain orientation="left" style={{color: "lightgray"}}>Insert options</Divider>

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
      </>
    </BaseModal>
  )
}

