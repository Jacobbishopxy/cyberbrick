/**
 * Created by Jacob Xie on 10/16/2020.
 */

import { useState, useMemo, useRef, useEffect, useContext } from "react"
import { Button, Col, Row, Space, Tooltip, Input } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { FormattedMessage, useIntl } from "umi"
import _ from 'lodash'

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText } from "@ant-design/pro-form"
import { max, min } from "lodash"

import { DashboardContext } from '@/components/Gallery/Dashboard/DashboardContext'
import './Common.less'
const EditorField = (props: ModuleEditorField) => {
  const dashboarContextProps = useContext(DashboardContext)
  const intl = useIntl()
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const onSubmit = async (values: Record<string, any>) => {
    const ctt = {
      ...content,
      data: { ...content?.data, ...values }
    } as DataType.Content
    console.log(22, content, ctt)
    setContent(ctt)
    if (props.setContent) {

      props.setContent(ctt)
    }
    return true
  }

  console.log(355, props.content, dashboarContextProps?.allContent)


  // 自动填充
  function getInitialValue() {
    // 如果本次content直接获取
    if (!_.isEmpty(props.content?.data)) {
      console.log(4111, {
        ...props.content?.data
      })
      return {
        ...props.content?.data
      }
    } else {
      // 从过往日期获取 ,判断条件：维度id和模块name和模块parentName 
      const content = dashboarContextProps?.allContent?.find((content) => content.templateInfo?.id === props.content?.templateInfo?.id && content.element?.name === props.content?.element?.name && content.element?.parentName == props.content?.element?.parentName)
      console.log(533, content)
      if (content) {
        return {
          stock: content.data?.stock,
          describe: content.data?.describe
        }
      } else {
        return {
          direction: 'B'
        }
      }
    }
  }
  return (
    <div className={props.styling}>
      <ModalForm
        title={intl.formatMessage({ id: "gallery.component.module-panel.miscellaneous.target-price1" })}
        trigger={
          <Button type="primary">
            <FormattedMessage id="gallery.component.general42" />
          </Button>
        }
        initialValues={getInitialValue()}
        onFinish={onSubmit}
        modalProps={{ width: "30vw" }}
      >
        <ProFormText
          name="stock"
          label={<FormattedMessage id="gallery.component.general63" />}
          placeholder="标的名称和代码,空格分隔"
          rules={[{ required: true, message: "此处不能为空" }]}
        />
        <ProFormText
          name="describe"
          label={<FormattedMessage id="gallery.component.general64" />}
          placeholder="简短概述"
        />
        <ProFormRadio.Group
          name="direction"
          label={<FormattedMessage id="gallery.component.general48" />}
          options={[
            { label: <FormattedMessage id="gallery.component.general49" />, value: "B" },
            { label: <FormattedMessage id="gallery.component.general50" />, value: "N" },
            { label: <FormattedMessage id="gallery.component.general51" />, value: "S" },
          ]}
          rules={[{ required: true, message: "Please choose a direction" }]}
        />
        <ProFormText
          name="price"
          label={<FormattedMessage id="gallery.component.general52" />}
          fieldProps={{ step: 0.01 }}
          placeholder="Please enter your target price"
          width="md"
          rules={[{ required: true, message: "Please enter target price" }]}
        />
        {/* <ProFormText
                    name="note"
                    label={<FormattedMessage id="gallery.component.general53" />}
                    placeholder="Please enter your note, this is optional"
                /> */}
      </ModalForm>
    </div>
  )
}

// const showDirection = (dir: string, pr: number, fontSize: number) => {
//     switch (dir) {
//         case "B":
//             return (
//                 <Row>
//                     <Col span={9} offset={2}>
//                         <span style={{ color: "white", background: "red", fontSize: fontSize }}>
//                             <FormattedMessage id="gallery.component.general49" />
//                         </span>
//                     </Col>
//                     <Col span={9} offset={4}>
//                         <span style={{ color: "red", fontSize: fontSize }}>{pr}</span>
//                     </Col>
//                 </Row>
//             )
//         case "S":
//             return (
//                 <Row>
//                     <Col span={9} offset={2}>
//                         <span style={{ color: "white", background: "green", fontSize: fontSize }}>
//                             <FormattedMessage id="gallery.component.general51" />
//                         </span>
//                     </Col>
//                     <Col span={9} offset={4}>
//                         <span style={{ color: "green", fontSize: fontSize }}>{pr}</span>
//                     </Col>
//                 </Row>
//             )
//         default:
//             return (
//                 <Row>
//                     <Col span={9} offset={2}>
//                         <span style={{ color: "white", background: "gray", fontSize: fontSize }}>
//                             <FormattedMessage id="gallery.component.general50" />
//                         </span>
//                     </Col>
//                     <Col span={9} offset={4}>
//                         <span style={{ color: "gray", fontSize: fontSize }}>{pr}</span>
//                     </Col>
//                 </Row>
//             )
//     }
// }
const showSuggest = (dir: string, pr: number, fontSize: number) => {
  switch (dir) {
    case "B":
      return (
        <span style={{ color: "white", background: "red", fontSize: fontSize }}>
          <FormattedMessage id="gallery.component.general49" />
        </span>
      )
    case "S":
      return (
        <span style={{ color: "white", background: "green", fontSize: fontSize }}>
          <FormattedMessage id="gallery.component.general51" />
        </span>
      )
    default:
      return (
        <span style={{ color: "white", background: "#F1C40F", fontSize: fontSize }}>
          <FormattedMessage id="gallery.component.general50" />
        </span>
      )
  }
}
const showTarget = (dir: string, pr: number, fontSize: number) => {
  switch (dir) {
    case "B":
      return (
        <span style={{ color: "red", fontSize: fontSize, fontWeight: "bold" }}>{pr}</span>
      )
    case "S":
      return (
        <span style={{ color: "green", fontSize: fontSize, fontWeight: "bold", }}>{pr}</span>
      )
    default:
      return (
        <span style={{ color: "#F1C40F", fontSize: fontSize, fontWeight: "bold", }}>{pr}</span>
      )
  }
}




const PresenterField = (props: ModulePresenterField) => {
  console.log(173, props.content)
  const fontSize = max([50, min([props.contentHeight ? props.contentHeight / 4 : 100])])
  // const textSize = max([12, min([props.contentHeight ? props.contentHeight / 8 : 25])])
  const textSize = 23

  const [value, setValue] = useState(props.initialValue)
  const [stock, setStock] = useState(props.content?.data?.stock)
  const [describe, setDescribe] = useState(props.content?.data?.describe)
  const [editStock, setEditStock] = useState<boolean>(false)
  const [editDescribe, setEditDescribe] = useState<boolean>(false)
  const intl = useIntl()
  //!ts类型待修正
  const TextAreaREF = useRef<any>(null);
  const inputREF = useRef<any>(null)
  // const onSave = () => {
  //   props.onSave(value)
  //   setEditStock(false)
  //   setEditDescribe(false)
  // }
  const genDescriptionText = () => {
    let arr: any[] = [];
    describe?.split('\n').forEach((item, index) => arr.push(<p key={index} style={{ textAlign: "left" }}>{item.trim()}</p>));
    console.log(195, arr)
    return arr.length ? arr : '一句话概述';
  }

  // const onChange = ({ target: { value } }: any) => {
  //   setValue(value);
  // }


  //获得焦点事件
  useEffect(() => {
    console.log(210, editStock)
    if (editStock) {
      inputREF.current?.focus({
        cursor: 'end'
      })
    }
    if (editDescribe) {
      TextAreaREF.current?.focus({
        cursor: 'end'
      })
    }
  }, [editStock, editDescribe])
  //点击编辑后设置textArea出现
  useEffect(() => {
    if (props.editable) {
      setEditDescribe(true)
    }
  }, [props.editable])

  useEffect(() => {
    setStock(props.content?.data?.stock)
    setDescribe(props.content?.data?.describe)
  }, [props.content?.data])




  const stockAndDescription = useMemo(() => {
    return (

      <div style={{
        borderBottom: '1px solid #ccc'
      }}>

        {/* 标的名字 */}
        <Row className={'targetPrice-stock'}>
          <Col span={22} offset={1}>
            {stock ? stock : '标的名称'}
          </Col>
        </Row>
        {/* 描述 */}
        <Row style={{
          marginBottom: '10px',
          fontSize: '16px',
        }} >
          <Col span={22} offset={1}>
            {genDescriptionText() ? genDescriptionText() : '一句话概述'}
          </Col>
        </Row>





      </div>
    )
  }, [props.editable, editStock, editDescribe, stock, describe])


  return props.content ?
    <div >
      {/* 标的和描述 */}
      {stockAndDescription}

      <Row align="middle">
        {/* 评级 */}
        <Col span={5} offset={1}>
          <span style={{ fontSize: textSize }}>
            <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price2" />
          </span>
        </Col>
        {/* 方向 */}
        <Col span={6} >
          {
            showSuggest(props.content?.data?.direction, props.content?.data?.price, textSize! + 14)
          }
        </Col>
        {/* 【目标价】 */}
        <Col span={5} offset={1}>
          <span style={{ fontSize: textSize }}>
            <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price3" />
          </span>
        </Col>
        {/* 价格 */}
        <Col span={6} >
          {
            showTarget(props.content?.data?.direction, props.content?.data?.price, textSize! + 14)
          }
        </Col>
      </Row>

      {/* {showDirection(props.content?.data?.direction, props.content?.data?.price, fontSize!)} */}

      <Row>
        <Col offset={2}>{props.content?.data?.note}</Col>
      </Row>
    </div>
    // </Space>
    : <></>
}


export const TargetPrice = new ModuleGenerator(EditorField, PresenterField).generate()

// 