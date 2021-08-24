import { Button, Col, Row, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea"
import { useEffect, useState } from "react"
import { useIntl } from "umi";

export interface ModuleDescriptionProps {
    editable: boolean
    initialValue: string
    onSave: (v: string) => void
}

export const ModuleDescirption = (props: ModuleDescriptionProps) => {
    const [value, setValue] = useState(props.initialValue)
    const [editable, setEditable] = useState<boolean>(true)
    const intl = useIntl()

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

    const descriptionStyle = { paddingLeft: 10, paddingRight: 10, height: 100, overflow: "auto" }

    const editableyDescription = <Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.description" })}>
        <Row onClick={() => setEditable(true)}
            style={descriptionStyle}>
            <Col span={24}> {genDescriptionText()} </Col>
        </Row>
    </Tooltip>

    const displayDescription = <Row style={descriptionStyle}>
        <Col span={24}> {genDescriptionText()} </Col>
    </Row>

    return (
        props.editable ?
            editable ?
                <Row style={{ paddingLeft: 10, paddingRight: 10, height: 100 }}>
                    <Col span={24}>
                        <TextArea value={value}
                            style={{ border: "2px solid #cacaca" }}
                            autoSize={{ minRows: 2, maxRows: 2 }}
                            onChange={onChange}
                            placeholder={intl.formatMessage({ id: "gallery.component.category-config-table22" })}
                        /></Col>
                    <Col span={24}> <Button style={{ paddingTop: 5 }} onClick={onSave} block type="primary">
                        Submit Description
                    </Button></Col>
                </Row>
                : editableyDescription
            : displayDescription
    )
}