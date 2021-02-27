/**
 * Created by Jacob Xie on 11/24/2020
 */

import {useState} from "react"
import {Button, Input, Space} from "antd"
import {CaretRightOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons"
import {FormattedMessage} from "umi"

import {EditorButton} from "@/components/Editor"

export const QueryViewer = (props: { onClick: (value: boolean) => void }) =>
  <EditorButton
    icons={{open: <PlusOutlined/>, close: <MinusOutlined/>}}
    name={{
      open: <FormattedMessage id="gallery.component.dataset-controller-query-field1"/>,
      close: <FormattedMessage id="gallery.component.dataset-controller-query-field2"/>
    }}
    size="small"
    onChange={props.onClick}
  />

interface QueryFieldProps {
  queryVisible: boolean
  onExecute: (sql: string) => void
}

export const QueryField = (props: QueryFieldProps) => {
  const [sqlStr, setSqlStr] = useState<string>()

  const onExecute = () => {
    if (sqlStr) props.onExecute(sqlStr)
  }

  return props.queryVisible ?
    <Space direction="vertical" style={{width: "100%"}}>
      <Input.TextArea
        rows={5}
        allowClear
        onChange={e => setSqlStr(e.target.value)}
      />
      <Button
        type="primary"
        size="small"
        icon={<CaretRightOutlined/>}
        onClick={onExecute}
      >
        <FormattedMessage id="gallery.component.general28"/>
      </Button>
    </Space> : <></>
}

