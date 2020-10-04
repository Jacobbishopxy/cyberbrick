/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, { useState } from 'react'
import { Button, Checkbox, Form, message, Modal, Tabs, Upload } from "antd"
import { UploadOutlined } from '@ant-design/icons'
import { HotTable } from "@handsontable/react"
import moment from "moment"
import axios from "axios"

import { ModuleGenerator } from "../ModuleGenerator"
import * as DataType from "../../../DataType"
import { ModuleEditorField, ModulePresenterField } from "../data"

import "./EditableTable.less"

const postingUrl = "/api/fm/extractXlsxFile"

const genAxiosUrl = (d: string[]) => {
  if (d.length === 0) return postingUrl
  let r = `${ postingUrl }?`
  if (d.includes("head")) r += "head=true"
  if (d.includes("multiSheets")) r += "multiSheets=true"
  return r
}
const inputFileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}


const EditorField = (props: ModuleEditorField) => {
  const [form] = Form.useForm()

  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const saveContent = (d: object[]) => {
    const ctt = content ? {
      ...content,
      data: { data: d }
    } : {
      date: moment().format(),
      data: { data: d }
    }
    setContent(ctt)
    props.updateContent(ctt)
  }

  const uploadProps = {
    accept: inputFileType,
    multiple: false,
    beforeUpload: (file: File) => {
      setUploadFiles([file])
      return false
    },
    onRemove: () => setUploadFiles([]),
    fileList: uploadFiles.map((i, j) => ({ ...i, name: i.name, uid: String(j) }))
  }

  const onUploadFile = (params: string[]) => {
    if (uploadFiles.length !== 0) {
      const data = new FormData()
      data.append("xlsx_file", uploadFiles[0])
      setUploading(true)

      axios
        .post(genAxiosUrl(params), data)
        .then(res => {
          message.success(res.statusText)
          setUploading(false)
          setUploadFiles([])
          saveContent(res.data)
        })
        .catch(err => {
          setUploading(false)
          message.error(JSON.stringify(err, null, 2))
        })
    }
  }

  const onReset = () => {
    setUploading(false)
    setUploadFiles([])
    form.resetFields()
  }

  const onFinish = (v: any) => {
    const fo = v.fileOptions ? v.fileOptions : []
    onUploadFile(fo)
    onReset()
    setVisible(false)
  }

  return (
    <div className={ props.styling }>
      <Button
        type='primary'
        shape='round'
        size='small'
        onClick={ () => setVisible(true) }
      >
        Click here to modify
      </Button>
      <Modal
        title='Please enter link below:'
        visible={ visible }
        onOk={ onFinish }
        onCancel={ () => setVisible(false) }
        confirmLoading={ uploading }
      >
        <Form { ...formItemLayout } form={ form }>
          <Form.Item name="fileUpload" label="File">
            <Upload { ...uploadProps }>
              <Button icon={ <UploadOutlined/> }>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="fileOptions" label="Options">
            <Checkbox.Group>
              <Checkbox value="head">Has head</Checkbox>
              <Checkbox value="multiSheets">Multiple sheets</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )


}


const licenseKey = "non-commercial-and-evaluation"

const hotTableProps = {
  settings: {
    width: "100%",
    height: "100%"
  },
  colHeaders: true,
  rowHeaders: true,
  licenseKey,
}

interface SpreadsheetData {
  name: string
  data: object[]
}


const PresenterField = (props: ModulePresenterField) => {

  const singleS = (data: SpreadsheetData) => (
    <HotTable
      { ...hotTableProps }
      data={ data.data }
    />
  )

  const multiS = (data: SpreadsheetData[]) => (
    <Tabs tabPosition="bottom">
      {
        data.map((i: SpreadsheetData) =>
          <Tabs.TabPane tab={ i.name } key={ i.name }>
            <HotTable
              { ...hotTableProps }
              data={ i.data }
            />
          </Tabs.TabPane>
        )
      }
    </Tabs>
  )

  const view = (content: DataType.Content) => {
    const d = content.data.data
    if (d.length === 1) return singleS(d)
    return multiS(d)
  }

  return props.content ? view(props.content) : <></>
}

export const EditableTable = new ModuleGenerator(EditorField, PresenterField).generate()

