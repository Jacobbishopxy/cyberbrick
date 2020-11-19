/**
 * Created by Jacob Xie on 11/19/2020
 */

import React from 'react'
import {
  Checkbox,
  Divider,
  Form,
  InputNumber,
  Select,
} from "antd"

import {BaseModal} from "./BaseModal"


export interface FileExtractModalProps {
  setVisible: (value: boolean) => void
  visible: boolean
  upload: (option: Record<string, any>, data: any) => Promise<any>
  uploadResHandle: (value: any) => void
  multiSheetDisable?: boolean
}

export const FileExtractModal = (props: FileExtractModalProps) => {

  return (
    <BaseModal
      setVisible={props.setVisible}
      visible={props.visible}
      upload={props.upload}
      uploadResHandle={props.uploadResHandle}
    >
      <>
        {
          props.multiSheetDisable ? <></> :
            <>
              <Divider plain orientation="left" style={{color: "lightgray"}}>File options</Divider>

              <Form.Item name="fileOptions" label="File options">
                <Checkbox.Group>
                  <Checkbox
                    value="multiSheets"
                  >
                    Multiple sheets
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </>
        }

        <Divider plain orientation="left" style={{color: "lightgray"}}>Cell options</Divider>

        <Form.Item name="numberRounding" label="Rounding">
          <InputNumber
            min={0}
            max={10}
            precision={0}
          />
        </Form.Item>
        <Form.Item name="dateFormat" label="Date format">
          <Select>
            <Select.Option value="%Y">
              YYYY
            </Select.Option>
            <Select.Option value="%Y-%m">
              YYYY-MM
            </Select.Option>
            <Select.Option value="%Y-%m-%d">
              YYYY-MM-DD
            </Select.Option>
            <Select.Option value="%Y-%m-%d %H:%M:%S">
              YYYY-MM-DD HH:mm:ss
            </Select.Option>
          </Select>
        </Form.Item>
      </>
    </BaseModal>
  )
}

FileExtractModal.defaultProps = {
  multiSheetDisable: false
} as Partial<FileExtractModalProps>

