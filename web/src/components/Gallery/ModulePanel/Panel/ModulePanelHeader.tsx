/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useState, useRef, useContext } from "react"
import { Button, Col, Input, message, Row } from "antd"
import { FormattedMessage, useIntl } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import { HeaderController } from "./HeaderController"
import { data } from "@/pages/demo/Charts/mock/ls"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
interface ModulePanelHeaderProps {
  editable: boolean
  settable: boolean
  timeSeries?: boolean
  elementName?: string
  type: DataType.ElementType
  title: string | undefined
  date: string | undefined
  updateTitle: (v: string) => void
  editContent: (value: boolean) => void
  newContent: (date: string) => void
  confirmDelete: () => void
  editDate?: (date: string, isMessage?: boolean) => void
  onSelectDate?: (date: string) => void
  // updateContent: (content: DataType.Content) => void

  content: DataType.Content
  setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {
  // 标题是否编辑
  const [titleEditable, setTitleEditable] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(props.title)
  // elementName是否编辑
  const [elementNameEdit, setElementNameEdit] = useState<boolean>(false)
  const intl = useIntl()
  const NestedDedicatedProps = useContext(nestedDedicatedContext)

  useEffect(() => setTitle(props.title), [props.title])

  //获取时间序列

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value !== "") {
      setTitle(value)
      props.updateTitle(value)
    } else
      message.warning("title cannot be empty!")

    setTitleEditable(false)
  }



  const elementNameInputRef = useRef<any>(null)
  //点击标题聚焦
  useEffect(() => {
    if (elementNameEdit) {
      elementNameInputRef.current?.focus();
    }
  }, [elementNameEdit])

  function changeElementName(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    if (value !== "") {
      if (NestedDedicatedProps?.setElement) {
        NestedDedicatedProps.setElement(element => {
          return {
            ...element,
            name: value
          }
        })
      }
    } else
      message.warning("title cannot be empty!")

    setElementNameEdit(false)
  }

  const genElementName = () => {
    //don't display title since header separator is a "title" by itself
    if (props.type === DataType.ElementType.FieldHeader) return <></>

    // 编辑下
    if (props.editable) {
      if (elementNameEdit)
        return <Input
          ref={elementNameInputRef}
          placeholder={intl.formatMessage({ id: "gallery.component.general62" })}
          size="small"
          allowClear
          style={{ width: 200 }}
          onBlur={changeElementName}
          defaultValue={props.elementName}
        />
      else {
        return (
          <Button
            type="link"
            size="small"
            onClick={() => setElementNameEdit(true)}
          >
            {props.elementName}
          </Button>
        )
      }
    } else {
      return (
        <span style={{ fontWeight: "bold" }}>
          {props.elementName}
        </span>
      )
    }
  }

  const titleInputRef = useRef<any>(null)
  //点击标题聚焦
  useEffect(() => {
    if (titleEditable) {
      titleInputRef.current?.focus();
    }
  }, [titleEditable])

  const genTitle = () => {
    //don't display title since header separator is a "title" by itself
    if (props.type === DataType.ElementType.FieldHeader) return <></>
    if (titleEditable)
      return <Input
        ref={titleInputRef}
        placeholder={intl.formatMessage({ id: "gallery.component.general62" })}
        size="small"
        allowClear
        style={{ width: 200 }}
        onBlur={changeTitle}
        defaultValue={title}
      />
    const eleType = <FormattedMessage id={`gallery.component.type.${props.type}`} />

    console.log(79, props.editable, props.settable, props.type)
    if (props.editable) {
      const txt = <FormattedMessage id="gallery.component.module-panel.panel.module-panel-header1" />
      return (
        <Button
          type="link"
          size="small"
          onClick={() => setTitleEditable(true)}
        >
          {title ? title : <>{eleType} - {txt}</>}
        </Button>
      )
    }
    return (
      <span style={{ fontWeight: "bold" }}>
        {/* {title ? title : eleType} */}
        {title ? title : ''}
      </span>
    )
  }

  const genController = () => {
    return (<HeaderController
      editable={props.editable}
      // settable={props.settable}
      timeSeries={props.timeSeries}
      dateList={NestedDedicatedProps?.dateList}
      editDate={props.editDate}
      editContent={props.editContent}
      // newContent={props.newContent}
      confirmDelete={props.confirmDelete}
      onSelectDate={props.onSelectDate}
      setTitle={setTitle}
      // updateContent={props.updateContent}

      content={props.content}
      setContent={props.setContent}
      elementType={props.type}
      headName={props.elementName}
      setDate={props.setDate}
    />)
  }


  function getDate() {
    if (props.timeSeries) {
      if (props.content) {
        // if (Object.keys(props.content.data).length !== 0) {
        //     return DataType.timeToString(props.date!)
        // }
        if (props.content.date !== '') {
          return DataType.timeToString(props.date!)
        }
      }
    } else {
      return DataType.timeToString(props.date!)
    }

    return '';
  }

  console.log(126, props.elementName)
  return (
    <Row >
      {
        props.elementName ?
          <>
            <Col span={8} style={{ fontWeight: "bold" }}>
              {props.type === DataType.ElementType.FieldHeader ? '' : genElementName()}
            </Col>

            <Col span={8} style={{ textAlign: "center" }}>
              {genTitle()}
            </Col>

            <Col span={8}>
              <Row justify='end'>
                <Col  >
                  {
                    !props.timeSeries ? getDate() : ''
                  }

                </Col>
                <Col  >

                  {genController()}
                </Col>
              </Row>
            </Col>

          </> :
          <>
            <Col span={12} style={{ textAlign: "left" }}>
              {genTitle()}
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
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

