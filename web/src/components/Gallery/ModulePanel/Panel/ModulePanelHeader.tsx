/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, {useEffect, useState} from 'react'
import {Button, Col, Input, message, Row} from "antd"

import {HeaderController} from "./HeaderController"


interface ModulePanelHeaderProps {
  editable: boolean
  timeSeries?: boolean
  headName?: string
  title: string | undefined
  updateTitle: (v: string) => void
  editContent: (value: boolean) => void
  newContent: (date: string) => void
  confirmDelete: () => void
  dateList?: string[]
  editDate?: (date: string) => void
  onSelectDate?: (date: string) => void
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {

  const [titleEditable, setTitleEditable] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(props.title)

  useEffect(() => setTitle(props.title), [props.title])

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (value !== "") {
      setTitle(value)
      props.updateTitle(value)
    } else
      message.warning("title cannot be empty!")

    setTitleEditable(false)
  }

  const genTitle = () => {
    if (titleEditable)
      return <Input
        placeholder="Title"
        size="small"
        allowClear
        style={{width: 200}}
        onBlur={changeTitle}
        defaultValue={title}
      />
    if (props.editable)
      return <Button
        type="link"
        size="small"
        onClick={() => setTitleEditable(true)}
      >
        {title || "Please enter your title"}
      </Button>
    return <span style={{fontWeight: "bold"}}>{title}</span>
  }

  const genController = () =>
    <HeaderController
      editable={props.editable}
      timeSeries={props.timeSeries}
      dateList={props.dateList}
      editDate={props.editDate}
      editContent={props.editContent}
      newContent={props.newContent}
      confirmDelete={props.confirmDelete}
      onSelectDate={props.onSelectDate}
    />

  return (
    <Row style={{paddingLeft: 10, paddingRight: 10, height: 25}}>
      {
        props.headName ?
          <>
            <Col span={8} style={{fontWeight: "bold"}}>{props.headName}</Col>
            <Col span={8} style={{textAlign: "center"}}>
              {genTitle()}
            </Col>
            <Col span={8} style={{textAlign: "right"}}>
              {genController()}
            </Col>
          </> :
          <>
            <Col span={12} style={{textAlign: "left"}}>
              {genTitle()}
            </Col>
            <Col span={12} style={{textAlign: "right"}}>
              {genController()}
            </Col>
          </>
      }
    </Row>
  )
}


ModulePanelHeader.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelHeaderProps>
