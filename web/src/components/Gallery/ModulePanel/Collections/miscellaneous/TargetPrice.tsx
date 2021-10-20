/**
 * Created by Jacob Xie on 10/16/2020.
 */

import { useState } from "react"
import { Button, Col, Row, Space } from "antd"
import { FormattedMessage, useIntl } from "umi"

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText } from "@ant-design/pro-form"
import { max, min } from "lodash"


const EditorField = (props: ModuleEditorField) => {
    console.log('ed')
    const intl = useIntl()
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)

    const onSubmit = async (values: Record<string, any>) => {
        const ctt = {
            ...content,
            date: content?.date || DataType.today(),
            data: { ...content?.data, ...values }
        }
        setContent(ctt)
        props.updateContent(ctt)

        return true
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
                initialValues={{ direction: "B" }}
                onFinish={onSubmit}
                modalProps={{ width: "30vw" }}
            >
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
                <ProFormDigit
                    name="price"
                    label={<FormattedMessage id="gallery.component.general52" />}
                    min={0}
                    fieldProps={{ step: 0.01 }}
                    placeholder="Please enter your target price"
                    width="md"
                    rules={[{ required: true, message: "Please enter target price" }]}
                />
                <ProFormText
                    name="note"
                    label={<FormattedMessage id="gallery.component.general53" />}
                    placeholder="Please enter your note, this is optional"
                />
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
                <span style={{ color: "white", background: "gray", fontSize: fontSize }}>
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
                <span style={{ color: "gray", fontSize: fontSize, fontWeight: "bold", }}>{pr}</span>
            )
    }
}

const PresenterField = (props: ModulePresenterField) => {
    console.log('PresenterField')
    //responsive font-size
    const fontSize = max([50, min([props.contentHeight ? props.contentHeight / 4 : 100])])
    const textSize = max([12, min([props.contentHeight ? props.contentHeight / 8 : 25])])

    return props.content ?
        <Space direction="vertical" style={{ width: "100%", overflow: "auto" }} className={props.styling}>
            {/* <Row>
                <Col span={9} offset={2}>
                    <span style={{ fontWeight: "bold", fontSize: textSize }}>
                        <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price2" />
                    </span>
                </Col>
                <Col span={9} offset={4}>
                    <span style={{ fontWeight: "bold", fontSize: textSize }}>
                        <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price3" />
                    </span>
                </Col>
            </Row> */}
            <Row align="middle">
                <Col span={4} offset={1}>
                    <span style={{ fontSize: textSize }}>
                        <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price2" />
                    </span>
                </Col>
                <Col span={7} >
                    {
                        showSuggest(props.content?.data?.direction, props.content?.data?.price, textSize! + 14)
                    }
                </Col>
                <Col span={4} offset={1}>
                    <span style={{ fontSize: textSize }}>
                        <FormattedMessage id="gallery.component.module-panel.miscellaneous.target-price3" />
                    </span>
                </Col>
                <Col span={7} >
                    {
                        showTarget(props.content?.data?.direction, props.content?.data?.price, textSize! + 14)
                    }
                </Col>
            </Row>

            {/* {showDirection(props.content?.data?.direction, props.content?.data?.price, fontSize!)} */}

            <Row>
                <Col offset={2}>{props.content?.data?.note}</Col>
            </Row>
        </Space>
        : <></>
}


export const TargetPrice = new ModuleGenerator(EditorField, PresenterField).generate()

