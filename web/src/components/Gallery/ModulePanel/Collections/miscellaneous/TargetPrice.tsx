/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, {useState} from 'react'
import {Button, Col, Row, Space} from "antd"

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {ModalForm, ProFormDigit, ProFormRadio, ProFormText} from "@ant-design/pro-form"


const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const onSubmit = async (values: Record<string, any>) => {
    const ctt = {
      ...content,
      date: content?.date || DataType.today(),
      data: {...content?.data, ...values}
    }
    setContent(ctt)
    props.updateContent(ctt)

    return true
  }

  return (
    <div className={props.styling}>
      <ModalForm
        title="Setup your target price"
        trigger={<Button type="primary">Update</Button>}
        initialValues={{}}
        onFinish={onSubmit}
      >
        <ProFormRadio.Group
          name="direction"
          label="Direction"
          options={[
            {label: "Buy", value: "B"},
            {label: "Neutral", value: "N"},
            {label: "Sell", value: "S"},
          ]}
          rules={[{required: true, message: "Please choose a direction"}]}
        />
        <ProFormDigit
          name="price"
          label="Price"
          min={0}
          fieldProps={{step: 0.01}}
          placeholder="Please enter your target price"
          width="lg"
          rules={[{required: true, message: "Please enter target price"}]}
        />
        <ProFormText
          name="note"
          label="Note"
          placeholder="Please enter your note, this is optional"
        />
      </ModalForm>
    </div>
  )
}

const showDirection = (dir: string, pr: number) => {
  switch (dir) {
    case "B":
      return (
        <Row>
          <Col span={9} offset={2}>
            <span style={{color: "white", background: "red", fontSize: 100}}>Buy</span>
          </Col>
          <Col span={9} offset={4}>
            <span style={{color: "red", fontSize: 100}}>{pr}</span>
          </Col>
        </Row>
      )
    case "S":
      return (
        <Row>
          <Col span={9} offset={2}>
            <span style={{color: "white", background: "green", fontSize: 100}}>Sell</span>
          </Col>
          <Col span={9} offset={4}>
            <span style={{color: "green", fontSize: 100}}>{pr}</span>
          </Col>
        </Row>
      )
    default:
      return (
        <Row>
          <Col span={9} offset={2}>
            <span style={{color: "white", background: "gray", fontSize: 100}}>Neutral</span>
          </Col>
          <Col span={9} offset={4}>
            <span style={{color: "gray", fontSize: 100}}>{pr}</span>
          </Col>
        </Row>
      )
  }
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <Space direction="vertical" style={{width: "100%"}} className={props.styling}>
      <Row>
        <Col span={9} offset={2}>
          <span style={{fontWeight: "bold", fontSize: 25}}>Investment advice</span>
        </Col>
        <Col span={9} offset={4}>
          <span style={{fontWeight: "bold", fontSize: 25}}>Target price</span>
        </Col>
      </Row>

      {showDirection(props.content?.data?.direction, props.content?.data?.price)}

      <Row>
        <Col offset={2}>{props.content?.data?.note}</Col>
      </Row>
    </Space> : <></>

export const TargetPrice = new ModuleGenerator(EditorField, PresenterField).generate()

