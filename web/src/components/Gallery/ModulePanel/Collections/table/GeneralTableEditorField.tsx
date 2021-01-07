/**
 * Created by Jacob Xie on 12/30/2020
 */

import React, {useState} from 'react'
import {Button, Form, message, Modal, Select, Space} from "antd"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"
import {ProFormCheckbox, ProFormRadio, StepsForm} from "@ant-design/pro-form"
import _ from "lodash"

import * as DataType from "../../../GalleryDataType"
import {ModuleEditorField} from "../../Generator/data"
import {DataSelectedType, DataSourceSelectorForm} from "./DataSourceSelectorForm"


type ViewStyle = "default" | "xlsx"

const viewStyleOptions = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: "Xlsx",
    value: "xlsx"
  }
]

type ViewOption = "header" | "border"

const viewOptionOptions = [
  {
    label: "Hide header",
    value: "header"
  },
  {
    label: "Hide border",
    value: "border"
  }
]

type ColumnTypeOptions = "default" | "date" | "number" | "percent" | "bar"

const columnTypeOptions = [
  "default",
  "date",
  "number",
  "percent",
  "bar",
]

export interface DisplayType {
  column: string
  type: ColumnTypeOptions
}

export interface GeneralTableConfigInterface {
  type: DataSelectedType
  display: DisplayType[]
  style: ViewStyle
  view: ViewOption[]
}

export const GeneralTableEditorField = (props: ModuleEditorField) => {

  const [visible, setVisible] = useState(false)
  const [dataType, setDataType] = useState<DataSelectedType>()
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [dataColumns, setDataColumns] = useState<string[]>([])

  const saveContent = async (config: Record<string, any>) => {
    if (content) {
      const c = config as GeneralTableConfigInterface
      const ctt = {
        ...content,
        date: content.date || DataType.today(),
        config: {...c, type: dataType}
      }
      props.updateContent(ctt)
      message.success("Updating succeeded!")
    } else
      message.warn("Updating failed! Please ")
    setVisible(false)
  }

  const dataSelectOnFinish = async () => {
    if (content?.data === undefined || content?.data.length === 0) {
      message.warn("Please choose your data!")
      return false
    }
    if (dataType === "file") {
      setDataColumns(_.values(content!.data[0][0]))
      return true
    }
    if (dataType === "dataset") {
      setDataColumns(content!.data.selects)
      return true
    }
    message.warn("Please check data format!")
    return false
  }

  return (
    <div className={props.styling}>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
      >
        Modify
      </Button>

      <StepsForm
        onFinish={saveContent}
        stepsFormRender={(dom, submitter) =>
          <Modal
            title="Setup process"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        }
      >
        <StepsForm.StepForm
          name="data"
          title="Data"
          onFinish={dataSelectOnFinish}
        >
          <DataSourceSelectorForm
            content={content}
            saveContent={setContent}
            fetchStorages={props.fetchStorages!}
            fetchTableList={props.fetchTableList!}
            fetchTableColumns={props.fetchTableColumns!}
            dataType={dataType}
            dataSelected={setDataType}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm
          name="option"
          title="Option"
          initialValues={{"style": "default"}}
        >
          <ProFormRadio.Group
            name="style"
            label="View style"
            options={viewStyleOptions}
          />
          <ProFormCheckbox.Group
            name="view"
            label="View option"
            options={viewOptionOptions}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm
          name="display"
          title="Display"
        >
          <Form.List name="display">
            {(fields, {add, remove}) =>
              <>
                {fields.map((field) =>
                  <Space key={field.key} style={{display: "flex"}}>
                    <Form.Item
                      {...field}
                      name={[field.name, "column"]}
                      fieldKey={[field.fieldKey, "column"]}
                      label="Column"
                      rules={[{required: true, message: "Missing field"}]}
                    >
                      <Select placeholder="Column" style={{width: 100}}>
                        {
                          dataColumns.map(c =>
                            <Select.Option key={c} value={c}>{c}</Select.Option>
                          )
                        }
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "type"]}
                      fieldKey={[field.fieldKey, "type"]}
                      label="Type"
                      rules={[{required: true, message: "Missing field"}]}
                    >
                      <Select placeholder="Type" style={{width: 100}}>
                        {
                          columnTypeOptions.map(t =>
                            <Select.Option key={t} value={t}>{t}</Select.Option>
                          )
                        }
                      </Select>
                    </Form.Item>

                    <DeleteTwoTone
                      twoToneColor="red"
                      onClick={() => remove(field.name)}
                      style={{fontSize: 20, marginTop: 7}}
                    />
                  </Space>
                )}
                <Form.Item>
                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined/>}
                    onClick={() => add()}
                  >
                    Add criteria
                  </Button>
                </Form.Item>
              </>
            }
          </Form.List>
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  )
}

