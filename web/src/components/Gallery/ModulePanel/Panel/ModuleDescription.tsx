import { Button, Col, Row, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea"
// import { useRef } from "dva/node_modules/@types/react";
import { useEffect, useState, useRef } from "react"
import { useIntl } from "umi";
// import {TextAreaRef} from "antd/lib/input/TextArea"
export interface ModuleDescriptionProps {
    editable: boolean
    initialValue: string
    onSave: (v: string) => void
}

export const ModuleDescirption = (props: ModuleDescriptionProps) => {
    const [value, setValue] = useState(props.initialValue)
    const [editable, setEditable] = useState<boolean>(true)
    const intl = useIntl()
    //!ts类型待修正
    const TextAreaREF = useRef<any>(null);
    useEffect(() => {
        setValue(props.initialValue)
    }, [props.initialValue])

    const onSave = () => {
        props.onSave(value)
        setEditable(false)
    }

    const genDescriptionText = () => {
        let arr: any[] = [];
        value.split('\n').forEach((item, index) => arr.push(<p key={index} style={{ textAlign: "center" }}>{item.trim()}</p>));
        return arr;
    }

    const onChange = ({ target: { value } }: any) => {
        setValue(value);
    };

    // const defaultStyle = { paddingLeft: 10, paddingRight: 10, height: "5%", maxHeight: 100 }

    // const descriptionStyle = { ...defaultStyle, overflow: "auto" }

    const editableyDescription = <Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.description" })}>
        <Row onClick={() => {
            setEditable(true);
            TextAreaREF.current?.focus({
                cursor: 'start'
            })
            console.log(43, TextAreaREF)
        }}
            /* style={descriptionStyle} */>
            <Col span={24}> {genDescriptionText()} </Col>
        </Row>
    </Tooltip>

    const displayDescription = <Row /* style={descriptionStyle} */>
        <Col span={24}> {genDescriptionText()} </Col>
    </Row>
    console.log(50, props.editable)
    return (
        props.editable ?
            editable ?
                <Row style={{ height: '100%' }}>
                    <Col span={24}>
                        <TextArea
                            ref={TextAreaREF}
                            value={value}
                            onBlur={onSave}
                            style={{ border: "2px solid #cacaca" }}
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            onChange={onChange}
                            placeholder={intl.formatMessage({ id: "gallery.component.category-config-table22" })}
                            allowClear
                        /></Col>
                    {/* <Col span={24}> <Button style={{ paddingTop: 5 }} onClick={onSave} block type="primary">

                        {intl.formatMessage({ id: "gallery.component.module-panel.graph.utils.common2" })}
                    </Button></Col> */}
                </Row>
                : editableyDescription
            : displayDescription
    )
}