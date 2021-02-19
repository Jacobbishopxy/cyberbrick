/**
 * Created by Jacob Xie on 11/19/2020
 */

import {
  Checkbox,
  Divider,
  Form,
  InputNumber,
  Select,
} from "antd"
import {FormattedMessage} from "umi"

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
      initialValues={{numberRounding: 2, dateFormat: "%Y-%m-%d"}}
      setVisible={props.setVisible}
      visible={props.visible}
      upload={props.upload}
      uploadResHandle={props.uploadResHandle}
    >
      {
        props.multiSheetDisable ? <></> :
          <>
            <Divider plain orientation="left" style={{color: "lightgray"}}>
              <FormattedMessage id="component.fileUploadModal.fileExtractModal.fileOptions"/>
            </Divider>

            <Form.Item
              name="fileOptions"
              label={<FormattedMessage id="component.fileUploadModal.fileExtractModal.fileOptions"/>}
            >
              <Checkbox.Group>
                <Checkbox
                  value="multiSheets"
                >
                  <FormattedMessage id="component.fileUploadModal.fileExtractModal.multiSheets"/>
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </>
      }

      <Divider plain orientation="left" style={{color: "lightgray"}}>
        <FormattedMessage id="component.fileUploadModal.fileExtractModal.cellOptions"/>
      </Divider>

      <Form.Item
        name="numberRounding"
        label={<FormattedMessage id="component.fileUploadModal.fileExtractModal.rounding"/>}
      >
        <InputNumber
          min={0}
          max={10}
          precision={0}
        />
      </Form.Item>
      <Form.Item
        name="dateFormat"
        label={<FormattedMessage id="component.fileUploadModal.fileExtractModal.dateFormat"/>}
      >
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
    </BaseModal>
  )
}

FileExtractModal.defaultProps = {
  multiSheetDisable: false
} as Partial<FileExtractModalProps>

