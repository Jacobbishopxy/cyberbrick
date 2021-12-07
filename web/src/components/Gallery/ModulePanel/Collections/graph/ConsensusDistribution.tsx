
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { Row, Col, Button, message } from 'antd'
import { FormattedMessage, useIntl } from "umi"

import * as DataType from "../../../GalleryDataType"
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText } from "@ant-design/pro-form"

import { useState } from "react"
import './styles.less'
interface PriceChartProps {
    minimumPrice: string,
    topPrice: string,
    medianPrice: string,
    targetPrice: string
}
const EditorField = (props: ModuleEditorField) => {
    const intl = useIntl()
    const onFinish = async (values: Record<string, any>) => {
        const { minPrice, topPrice, medianPrice, targetPrice } = values
        console.log(24, values, minPrice, topPrice, medianPrice, targetPrice)
        if (props.setContent) {
            props.setContent((content) => {
                return {
                    ...content,
                    data: {
                        minPrice,
                        topPrice,
                        medianPrice,
                        targetPrice
                    }
                } as DataType.Content
            })
            message.success('操作成功！')

        }
        return true
    }
    return (
        <div className="consensusDistributionEditorField">
            <ModalForm
                title={intl.formatMessage({ id: "gallery.component.module-panel.miscellaneous.target-price1" })}
                trigger={
                    <Button type="primary">
                        <FormattedMessage id="gallery.component.general42" />
                    </Button>
                }
                initialValues={{ direction: "B" }}
                onFinish={onFinish}
                modalProps={{ width: "30vw" }}
            >
                <ProFormText
                    name="minPrice"
                    label={<FormattedMessage id="gallery.component.general65" />}
                    placeholder="最低价"
                    rules={[{ required: true, message: "此处不能为空" }]}
                />
                <ProFormText
                    name="topPrice"
                    label={<FormattedMessage id="gallery.component.general66" />}
                    placeholder="最高价"
                    rules={[{ required: true, message: "此处不能为空" }]}
                />
                <ProFormText
                    name="medianPrice"
                    label={<FormattedMessage id="gallery.component.general67" />}
                    placeholder="中位价"
                    rules={[{ required: true, message: "此处不能为空" }]}
                />
                <ProFormText
                    name="targetPrice"
                    label={<FormattedMessage id="gallery.component.general68" />}
                    placeholder="期望价"
                    rules={[{ required: true, message: "此处不能为空" }]}
                />
            </ModalForm>
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) => {
    console.log(200, props)
    const regexp = /\d+\.\d+|\d+/
    // 最低值
    const minPriceNumber: number = regexp.exec(props.content?.data?.minPrice) ? parseInt(regexp.exec(props.content?.data?.minPrice)![0]) : 0
    // 最高值
    const topPriceNumber = regexp.exec(props.content?.data?.topPrice) ? parseInt(regexp.exec(props.content?.data?.topPrice)![0]) : 0
    // 中位值
    const medianPriceNumber = regexp.exec(props.content?.data?.medianPrice) ? parseInt(regexp.exec(props.content?.data?.medianPrice)![0]) : 0
    //预期值
    const targetPriceNumber = regexp.exec(props.content?.data?.targetPrice) ? parseInt(regexp.exec(props.content?.data?.targetPrice)![0]) : 0
    //中位值方块的x轴位置
    const medianL: number = (medianPriceNumber - minPriceNumber) / (topPriceNumber - minPriceNumber) * 100
    //预期值方块的x轴位置
    const targetL = ((targetPriceNumber - minPriceNumber) / (topPriceNumber - minPriceNumber)) * 100

    console.log(34, medianL, targetL)
    return (
        <div className={"consensusDistributionPresenterField"}>
            <Row
                className="body"
                align="middle">

                {/* 最低值 */}
                <Col span={3} className={"minPrice"} >{props.content?.data?.minPrice} </Col>

                {/* 区间 */}
                <Col offset={1} span={16} className="section">

                    {/* 中位值 */}
                    <div className="medianPrice" style={{
                        left: medianL + '%'
                    }} data-content={props.content?.data?.medianPrice}></div>

                    {/* 期望值 */}
                    <div className="targetPrice" style={{ left: targetL + '%' }} data-content={props.content?.data?.targetPrice}></div>
                </Col>

                {/* 最高值 */}
                <Col span={3} offset={1} className={"topPrice"} >{props.content?.data?.topPrice}</Col>
            </Row>

            <Row className="btm">
                <Col offset={15} className="left">
                    <FormattedMessage id="gallery.component.general67" />
                </Col>
                <Col offset={3} className="right">
                    <FormattedMessage id="gallery.component.general68" />
                </Col>
            </Row>
        </div>
    )
}
export const ConsensusDistribution = new ModuleGenerator(EditorField, PresenterField).generate()
