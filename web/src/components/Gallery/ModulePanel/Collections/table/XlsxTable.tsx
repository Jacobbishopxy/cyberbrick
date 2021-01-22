/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, {useState} from 'react'
import {Button, message, Modal, Tabs} from "antd"
import {HotTable} from "@handsontable/react"
import {ProFormCheckbox, StepsForm} from "@ant-design/pro-form"
import _ from "lodash"

import {FileExtractModal} from "@/components/FileUploadModal"
import {XlsxTableConfigInterface} from "@/components/Gallery/Utils/data"
import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {fileExtract} from "../../../Misc/FileUploadConfig"

import "handsontable/dist/handsontable.full.css"


const viewOptionOptions = [
  {
    label: "Hide column",
    value: "col"
  },
  {
    label: "Hide row",
    value: "row"
  }
]
const licenseKey = "non-commercial-and-evaluation"

// todo: editing in two ways: 1. upload file, 2. edit cell
const EditorField = (props: ModuleEditorField) => {

  const [visible, setVisible] = useState<boolean>(false)
  const [uploadVisible, setUploadVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const saveContentData = (data: any) => {
    const ctt = content ? {
      ...content,
      data
    } : {
      date: DataType.today(),
      data
    }
    setContent(ctt)
  }

  const saveContent = async (config: Record<string, any>) => {
    if (content) {
      const c = config as XlsxTableConfigInterface
      const ctt = {
        ...content,
        date: content.date || DataType.today(),
        config: {...c, hideOptions: c.hideOptions || []}
      }
      props.updateContent(ctt)
      message.success("Updating succeeded!")
    } else {
      message.warn("Updating failed! File and options are required!")
    }
    setVisible(false)
  }

  const dataSelectOnFinish = async () => {
    if (content?.data === undefined || _.isEmpty(content.data)) {
      message.warn("Please check your data if is empty!")
      return false
    }
    return true
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
            width="30vw"
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
          <Button
            type="primary"
            onClick={() => setUploadVisible(true)}
          >
            Click
          </Button>
          <FileExtractModal
            setVisible={setUploadVisible}
            visible={uploadVisible}
            upload={fileExtract}
            uploadResHandle={saveContentData}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm
          name="option"
          title="Option"
        >
          <ProFormCheckbox.Group
            name="hideOptions"
            label="Hide options"
            options={viewOptionOptions}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  )
}

export const genHotTableProps = (height: number | undefined, hideOptions?: string[]) => {
  const colHeaders = !hideOptions?.includes("col")
  const rowHeaders = !hideOptions?.includes("row")
  return {
    readOnly: true,
    settings: {
      width: "100%",
      height: height ? height - 50 : undefined
    },
    colHeaders,
    rowHeaders,
    licenseKey,
  }
}

const PresenterField = (props: ModulePresenterField) => {

  const singleS = (data: Record<string, any[]>) => (
    <HotTable
      {...genHotTableProps(props.contentHeight, props.content?.config?.hideOptions)}
      data={data["0"]}
    />
  )

  const multiS = (data: Record<string, any[]>) => {
    const d: any[] = []
    _.mapValues(data, (v: any[], k: string) => {
      d.push(
        <Tabs.TabPane tab={k} key={k}>
          <HotTable
            {...genHotTableProps(props.contentHeight, props.content?.config?.hideOptions)}
            data={v}
          />
        </Tabs.TabPane>
      )
    })

    return <Tabs tabPosition="bottom">{d}</Tabs>
  }

  const view = (content: DataType.Content) => {
    const d = _.keys(content.data)
    if (d) {
      if (d.length === 1)
        return singleS(content.data)
      return multiS(content.data)
    }
    return <></>
  }

  return props.content && props.content.data ?
    <div className={props.styling}>{view(props.content)}</div> : <></>
}

export const XlsxTable = new ModuleGenerator(EditorField, PresenterField).generate()

