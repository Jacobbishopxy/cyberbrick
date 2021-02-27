/**
 * Created by Jacob Xie on 10/16/2020.
 */

import {useState} from "react"
import {Button, Col, Row, Space} from "antd"
import {FormattedMessage, useIntl} from "umi"

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {ModalForm, ProFormDigit, ProFormRadio, ProFormText} from "@ant-design/pro-form"


const EditorField = (props: ModuleEditorField) => {
  const intl = useIntl()
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
        title={intl.formatMessage({id: "gallery.component.module-panel.miscellaneous.target-price1"})}
        trigger={
          <Button type="primary">
            <FormattedMessage id="gallery.component.general42"/>
          </Button>
        }
        initialValues={{direction: "B"}}
        onFinish={onSubmit}
        modalProps={{width: "30vw"}}
      >
        <ProFormRadio.Group
          name="direction"
          label={<FormattedMessage id="gallery.component.general48"/>}
          options={[
            {label: <FormattedMessage id="gallery.component.general49"/>, value: "B"},
            {label: <FormattedMessage id="gallery.component.general50"/>, value: "N"},
            {label: <FormattedMessage id="gallery.component.general51"/>, value: "S"},
          ]}
          rules={[{required: true, message: "Please choose a direction"}]}
        />
        <ProFormDigit
          name="price"
          label={<FormattedMessage id="gallery.component.general52"/>}
          min={0}
          fieldProps={{step: 0.01}}
          placeholder="Please enter your target price"
          width="md"
          rules={[{required: true, message: "Please enter target price"}]}
        />
        <ProFormText
          name="note"
          label={<FormattedMessage id="gallery.component.general53"/>}
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
            <span style={{color: "white", background: "red", fontSize: 100}}>
              <FormattedMessage id="gallery.component.general49"/>
            </span>
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
            <span style={{color: "white", background: "green", fontSize: 100}}>
              <FormattedMessage id="gallery.component.general51"/>
            </span>
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
            <span style={{color: "white", background: "gray", fontSize: 100}}>
              <FormattedMessage id="gallery.component.general50"/>
            </span>
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
          <span style={{fontWeight: "bold", fontSize: 25}}>
            <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price2"/>
          </span>
        </Col>
        <Col span={9} offset={4}>
          <span style={{fontWeight: "bold", fontSize: 25}}>
            <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price3"/>
          </span>
        </Col>
      </Row>

      {showDirection(props.content?.data?.direction, props.content?.data?.price)}

      <Row>
        <Col offset={2}>{props.content?.data?.note}</Col>
      </Row>
    </Space> : <></>

export const TargetPrice = new ModuleGenerator(EditorField, PresenterField).generate()

