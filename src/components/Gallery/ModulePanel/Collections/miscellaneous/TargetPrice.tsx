/**
 * Created by Jacob Xie on 10/16/2020.
 */

import React, { useState } from 'react'
import { Button, Col, Input, InputNumber, message, Radio, Row, Space } from "antd"
import { RadioChangeEvent } from "antd/lib/radio"

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"


const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const radioOnChange = (e: RadioChangeEvent) => {
    if (content) setContent({
      ...content,
      data: { ...content.data, direction: e.target.value }
    })
    else setContent({
      date: DataType.today(),
      data: { direction: e.target.value }
    })
  }

  const inputNumberOnChange = (v: number | string | undefined) => {
    if (content) setContent({
      ...content,
      data: { ...content.data, price: v }
    })
    else setContent({
      date: DataType.today(),
      data: { price: v }
    })
  }

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (content) setContent({
      ...content,
      data: { ...content.data, note: e.target.value }
    })
    else setContent({
      date: DataType.today(),
      data: { note: e.target.value }
    })
  }

  const buttonOnSave = () => {
    if (content && content.data.direction && content.data.price) {
      props.updateContent(content)
      message.success("Saving succeeded!")
    } else
      message.warn("Direction & Price is required!")
  }

  return (
    <div className={ props.styling }>
      <Space
        align="center"
        direction="vertical"
        style={ { position: "relative", top: "25%" } }
      >
        <Radio.Group
          onChange={ radioOnChange }
          defaultValue={ content?.data.direction }
        >
          <Radio value="B">Buy</Radio>
          <Radio value="N">Neutral</Radio>
          <Radio value="S">Sell</Radio>
        </Radio.Group>
        <InputNumber
          min={ 0 }
          step={ 0.01 }
          onChange={ inputNumberOnChange }
          defaultValue={ content?.data.price || 0 }
        />
        <Input
          placeholder="Note"
          onChange={ inputOnChange }
          defaultValue={ content?.data.note }
        />
        <Button
          type="primary"
          onClick={ buttonOnSave }
        >
          Save
        </Button>
      </Space>
    </div>
  )
}

const showDirection = (dir: string, pr: number) => {
  switch (dir) {
    case "B":
      return (
        <Row>
          <Col span={ 6 } offset={ 4 }>
            <span style={ { color: "white", background: "red", fontSize: 100 } }>Buy</span>
          </Col>
          <Col span={ 6 } offset={ 6 }>
            <span style={ { color: "red", fontSize: 100 } }>{ pr }</span>
          </Col>
        </Row>
      )
    case "S":
      return (
        <Row>
          <Col span={ 6 } offset={ 4 }>
            <span style={ { color: "white", background: "green", fontSize: 100 } }>Sell</span>
          </Col>
          <Col span={ 6 } offset={ 6 }>
            <span style={ { color: "green", fontSize: 100 } }>{ pr }</span>
          </Col>
        </Row>
      )
    default:
      return (
        <Row>
          <Col span={ 6 } offset={ 4 }>
            <span style={ { color: "white", background: "gray", fontSize: 100 } }>Neutral</span>
          </Col>
          <Col span={ 6 } offset={ 6 }>
            <span style={ { color: "gray", fontSize: 100 } }>{ pr }</span>
          </Col>
        </Row>
      )
  }
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <Space direction="vertical" style={ { width: "100%" } } className={ props.styling }>
      <Row>
        <Col span={ 6 } offset={ 4 }>
          <span style={ { fontWeight: "bold", fontSize: 25 } }>Investment advice</span>
        </Col>
        <Col span={ 6 } offset={ 6 }>
          <span style={ { fontWeight: "bold", fontSize: 25 } }>Target price</span>
        </Col>
      </Row>

      { showDirection(props.content.data.direction, props.content.data.price) }

      <Row>
        <Col offset={ 2 }>{ props.content.data.note }</Col>
      </Row>
    </Space> : <></>

export const TargetPrice = new ModuleGenerator(EditorField, PresenterField).generate()

