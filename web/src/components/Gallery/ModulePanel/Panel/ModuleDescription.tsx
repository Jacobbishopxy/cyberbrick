import { CheckOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
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

    const editableyDescription = <Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.description" })}>
        <Row onClick={() => setEditable(true)}
            style={{ paddingLeft: 10, paddingRight: 10, height: 25, }}>
            <Col span={24}> {genDescriptionText()} </Col>
        </Row>
    </Tooltip>

    const displayDescription = <Row style={{ paddingLeft: 10, paddingRight: 10, height: 25 }}>
        <Col span={24}> {genDescriptionText()} </Col>
    </Row>

    return (
        props.editable ?
            editable ?
                <Row style={{ paddingLeft: 10, paddingRight: 10, height: 25, }}>
                    <TextArea value={value}
                        style={{ width: "90%" }}
                        onChange={onChange}
                        placeholder={intl.formatMessage({ id: "gallery.component.category-config-table22" })}
                        autoSize
                    />
                    <CheckOutlined style={{ paddingTop: 5 }}
                        onClick={onSave}
                    />
                </Row>
                : editableyDescription
            : displayDescription
    )
}