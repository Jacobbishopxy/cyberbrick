/**
 * Created by Jacob Xie on 12/23/2020
 */

import React, {useEffect, useState} from 'react'
import {Button, Checkbox, message, Space, Table, Tabs} from "antd"
import _ from "lodash"

import {FileExtractModal} from "@/components/FileUploadModal"
import {Emoji} from "@/components/Emoji"
import * as DataType from "../../../GalleryDataType"
import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import {fileExtract} from "../../../Misc/FileUploadConfig"
import {ColumnsType} from "antd/lib/table/interface"


const EditorField = (props: ModuleEditorField) => {

  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [savingConfig, setSavingConfig] = useState(false)
  const [savingData, setSavingData] = useState(false)

  useEffect(() => {
    if (content?.config) setSavingConfig(true)
    if (content?.data) setSavingData(true)
  }, [content])

  const saveContentConfig = (options: string[]) => {
    const ctt = {
      ...content!,
      date: DataType.today(),
      config: {view: options}
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
            onChange={vs => saveContentConfig(vs as string[])}
            defaultValue={content?.config?.hideOptions || ["header"]}
          >
            <Checkbox value="header">Hide header</Checkbox>
            <Checkbox value="border">Hide border</Checkbox>
          </Checkbox.Group>
        </Space>

        <Space>
          <Emoji label="0" symbol="②" size={20}/>
          <Button
            type='primary'
            shape='round'
            size='small'
            onClick={() => setVisible(true)}
            disabled={!savingConfig}
          >
            Click here to modify
          </Button>
        </Space>

        <Button
          type='primary'
          size='small'
          onClick={saveContent}
          disabled={!savingData}
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

interface FooterSelectorProps {
  tabs: string[]
  onChange: (tab: string) => void
}

const FooterSelector = (props: FooterSelectorProps) => {
  const {tabs} = props

  return tabs.length > 1 ?
    <Tabs onChange={props.onChange}>
      {
        tabs.map(t => <Tabs.TabPane tab={t} key={t}/>)
      }
    </Tabs> :
    <></>
}


interface FlexTableViewProps {
  data: Record<string, any[]>
  showHeader: boolean
  showBorder: boolean
  showPagination: boolean
}

const FlexTableView = (props: FlexTableViewProps) => {

  const [columns, setColumns] = useState<ColumnsType>([])
  const [data, setData] = useState<any[]>([])

  const setAll = (d: any[]) => {
    setColumns(_.keys(d[0]).map((k: string) => ({
      key: k,
      title: k,
      dataIndex: k
    })))
    setData(d)
  }

  useEffect(() => setAll(props.data[_.keys(props.data)[0]]), [])

  const footerTabOnChange = (tab: string) => setAll(props.data[tab])

  return (
    <Table
      columns={columns}
      dataSource={data}
      showHeader={props.showHeader}
      bordered={props.showBorder}
      pagination={props.showPagination ? undefined : false}
      footer={
        () => <FooterSelector tabs={_.keys(props.data)} onChange={footerTabOnChange}/>
      }
    />
  )
}

const PresenterField = (props: ModulePresenterField) => {

  return props.content && props.content.data ?
    <FlexTableView
      data={props.content.data}
      showHeader={!props.content.config?.view.includes("header")}
      showBorder={!props.content.config?.view.includes("border")}
      showPagination={false}
    /> : <></>
}

export const FlexTable = new ModuleGenerator(EditorField, PresenterField).generate()

