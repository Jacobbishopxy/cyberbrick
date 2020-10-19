/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, { useState } from 'react'
import { Button, Tabs } from "antd"
import { HotTable } from "@handsontable/react"

import { FileUploadModal } from "@/components/FileUploadModal"

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"

import "handsontable/dist/handsontable.full.css"

const postingUrl = "/api/fm/extractXlsxFile"

// todo: editing in two ways: 1. upload file, 2. edit cell
const EditorField = (props: ModuleEditorField) => {

  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const saveContent = (d: object[]) => {
    const ctt = content ? {
      ...content,
      data: { data: d }
    } : {
      date: DataType.today(),
      data: { data: d }
    }
    setContent(ctt)
    props.updateContent(ctt)
  }

  return (
    <div className={ props.styling }>
      <Button
        type='primary'
        shape='round'
        size='small'
        onClick={ () => setVisible(true) }
        style={ { position: "relative", top: "40%" } }
      >
        Click here to modify
      </Button>
      <FileUploadModal
        postingUrl={ postingUrl }
        setVisible={ setVisible }
        visible={ visible }
        upload={ saveContent }
      />
    </div>
  )
}

const licenseKey = "non-commercial-and-evaluation"

// todo: save colHeaders & rowHeaders in `content.config`
const genHotTableProps = (height: number | undefined) => ({
  readOnly: true,
  settings: {
    width: "100%",
    height: height ? height - 50 : undefined
  },
  colHeaders: true,
  rowHeaders: true,
  licenseKey,
})

interface SpreadsheetData {
  name: string
  data: object[]
}


const PresenterField = (props: ModulePresenterField) => {

  const singleS = (data: SpreadsheetData) => (
    <HotTable
      { ...genHotTableProps(props.contentHeight) }
      data={ data.data }
    />
  )

  const multiS = (data: SpreadsheetData[]) => (
    <Tabs tabPosition="bottom">
      {
        data.map((i: SpreadsheetData) =>
          <Tabs.TabPane tab={ i.name } key={ i.name }>
            <HotTable
              { ...genHotTableProps(props.contentHeight) }
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

  return props.content ? <div className={ props.styling }>{ view(props.content) }</div> : <></>
}

export const XlsxTable = new ModuleGenerator(EditorField, PresenterField).generate()

