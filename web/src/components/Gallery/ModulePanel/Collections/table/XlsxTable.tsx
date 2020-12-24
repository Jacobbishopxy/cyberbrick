/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, {useEffect, useState} from 'react'
import {Button, Checkbox, message, Space, Tabs} from "antd"
import {HotTable} from "@handsontable/react"
import _ from "lodash"

import {FileExtractModal} from "@/components/FileUploadModal"
import {Emoji} from "@/components/Emoji"

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {fileExtract} from "../../../Misc/FileUploadConfig"


import "handsontable/dist/handsontable.full.css"


// todo: editing in two ways: 1. upload file, 2. edit cell
const EditorField = (props: ModuleEditorField) => {

  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [savingProcessData, setSavingProcessData] = useState(false)

  useEffect(() => {
    if (content?.data) setSavingProcessData(true)
  }, [content])

  const saveContentConfigHideHeader = (options: string[]) => {
    const ctt = {
      ...content!,
      date: DataType.today(),
      config: {hideOptions: options}
    }
    setContent(ctt)
  }

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

  const saveContent = () => {
    if (content) {
      props.updateContent(content)
      message.success("Updating succeeded!")
    } else {
      message.warn("Updating failed! File and options are required!")
    }
  }

  return (
    <div className={props.styling}>
      <Space
        direction="vertical"
        style={{position: "relative", top: "30%"}}
      >
        <Space>
          <Emoji label="0" symbol="①" size={20}/>
          Viewing:
          <Checkbox.Group
            style={{width: "100%"}}
            onChange={vs => saveContentConfigHideHeader(vs as string[])}
            defaultValue={content?.config?.hideOptions || ["col", "row"]}
          >
            <Checkbox value="col">Hide column</Checkbox>
            <Checkbox value="row">Hide row</Checkbox>
          </Checkbox.Group>
        </Space>

        <Space>
          <Emoji label="0" symbol="②" size={20}/>
          <Button
            type='primary'
            shape='round'
            size='small'
            onClick={() => setVisible(true)}
          >
            Click here to modify
          </Button>
        </Space>

        <Button
          type='primary'
          size='small'
          onClick={saveContent}
          disabled={!savingProcessData}
        >
          Update
        </Button>
      </Space>

      <FileExtractModal
        setVisible={setVisible}
        visible={visible}
        upload={fileExtract}
        uploadResHandle={saveContentData}
      />
    </div>
  )
}

const licenseKey = "non-commercial-and-evaluation"

const genHotTableProps = (height: number | undefined, hideOptions?: string[]) => {

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

    return (
      <Tabs tabPosition="bottom">
        {d}
      </Tabs>
    )
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

