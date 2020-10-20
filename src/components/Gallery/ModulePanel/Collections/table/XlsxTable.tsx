/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Checkbox, message, Space, Tabs } from "antd"
import { HotTable } from "@handsontable/react"

import { FileUploadModal } from "@/components/FileUploadModal"
import { Emoji } from "@/components/Emoji"

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"

import "handsontable/dist/handsontable.full.css"

const postingUrl = "/api/fm/extractXlsxFile"

// todo: editing in two ways: 1. upload file, 2. edit cell
const EditorField = (props: ModuleEditorField) => {

  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [savingProcessHideOptions, setSavingProcessHideOptions] = useState(false)
  const [savingProcessData, setSavingProcessData] = useState(false)

  useEffect(() => {
    if (content?.config?.hideOptions) setSavingProcessHideOptions(true)
    if (content?.data) setSavingProcessData(true)
  }, [content])

  const saveContentConfigHideHeader = (options: string[]) => {
    const ctt = {
      ...content!,
      date: DataType.today(),
      config: { hideOptions: options }
    }
    setContent(ctt)
  }

  const saveContentData = (d: object[]) => {
    const ctt = content ? {
      ...content,
      data: { data: d }
    } : {
      date: DataType.today(),
      data: { data: d }
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
    <div className={ props.styling }>
      <Space
        direction="vertical"
        style={ { position: "relative", top: "30%" } }
      >
        <Space>
          <Emoji label="0" symbol="①" size={ 20 }/>
          Viewing:
          <Checkbox.Group
            style={ { width: "100%" } }
            onChange={ vs => saveContentConfigHideHeader(vs as string[]) }
            defaultValue={ content?.config?.hideOptions }
          >
            <Checkbox value="col">Hide column</Checkbox>
            <Checkbox value="row">Hide row</Checkbox>
          </Checkbox.Group>
        </Space>

        <Space>
          <Emoji label="0" symbol="②" size={ 20 }/>
          <Button
            type='primary'
            shape='round'
            size='small'
            onClick={ () => setVisible(true) }
            disabled={ !savingProcessHideOptions }
          >
            Click here to modify
          </Button>
        </Space>

        <Button
          type='primary'
          size='small'
          onClick={ saveContent }
          disabled={ !savingProcessData }
        >
          Update
        </Button>
      </Space>

      <FileUploadModal
        postingUrl={ postingUrl }
        setVisible={ setVisible }
        visible={ visible }
        upload={ saveContentData }
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

interface SpreadsheetData {
  name: string
  data: object[]
}


const PresenterField = (props: ModulePresenterField) => {

  const singleS = (data: SpreadsheetData) => (
    <HotTable
      { ...genHotTableProps(props.contentHeight, props.content?.config?.hideOptions) }
      data={ data[0].data }
    />
  )

  const multiS = (data: SpreadsheetData[]) => (
    <Tabs tabPosition="bottom">
      {
        data.map((i: SpreadsheetData) =>
          <Tabs.TabPane tab={ i.name } key={ i.name }>
            <HotTable
              { ...genHotTableProps(props.contentHeight, props.content?.config?.hideOptions) }
              data={ i.data }
            />
          </Tabs.TabPane>
        )
      }
    </Tabs>
  )

  const view = (content: DataType.Content) => {
    const d = content.data.data
    if (d) {
      if (d.length === 1)
        return singleS(d)
      return multiS(d)
    }
    return <></>
  }

  return props.content && props.content.data ?
    <div className={ props.styling }>{ view(props.content) }</div> : <></>
}

export const XlsxTable = new ModuleGenerator(EditorField, PresenterField).generate()

