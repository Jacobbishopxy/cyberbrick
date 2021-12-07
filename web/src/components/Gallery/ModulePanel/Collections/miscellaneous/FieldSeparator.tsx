/**
 * Created by Jacob Xie on 9/22/2020.
 */

import { useState } from "react"
import { Button } from "antd"
import { useIntl } from "umi"

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import { ModalForm, ProFormRadio, ProFormSelect, ProFormText } from "@ant-design/pro-form"

const fontList = [48, 60, 72, 84]
enum alignEnum {
    left = 'left',
    center = 'center',
    right = 'right'
}
const defaultSetting = {
    fontSize: fontList[0],
    textAlign: alignEnum.center
}
/**
 * Content data structure:
 * ..content,
 * data:{
 *     text: string
 *     fontSize: number
 *     textAlign: enum
 * }
 */
const EditorField = (props: ModuleEditorField) => {
    const intl = useIntl()
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)

    const onSubmit = async (values: Record<string, any>) => {
        const ctt = {
            ...content,
            date: content?.date || DataType.today(),
            data: values
        }
        setContent(ctt)
        if (props.setContent) {
            props.setContent(ctt)
        }

        return true
    }

    return (
        <div className={props.styling}>
            <ModalForm
                title={intl.formatMessage({ id: "gallery.component.general14" })}
                trigger={<Button type="primary">{intl.formatMessage({ id: "gallery.component.general13" })}</Button>}
                initialValues={content?.data || defaultSetting}
                onFinish={onSubmit}
            >
                <ProFormSelect
                    name="fontSize"
                    label={intl.formatMessage({ id: "gallery.component.module-panel.field-header.1" })}
                    options={fontList.map(size => { return { value: size, label: size } })}
                    fieldProps={{
                        optionItemRender(item) {
                            return <p style={{ fontSize: item.value, verticalAlign: "middle" }}>text</p>
                        }
                    }}
                />
                <ProFormRadio.Group
                    name="textAlign"
                    label={intl.formatMessage({ id: "gallery.component.module-panel.field-header.2" })}
                    options={[
                        {
                            label: intl.formatMessage({ id: "gallery.component.module-panel.field-header.3" }),
                            value: alignEnum.left,
                        },
                        {
                            label: intl.formatMessage({ id: "gallery.component.module-panel.field-header.4" }),
                            value: alignEnum.center,
                        },
                        {
                            label: intl.formatMessage({ id: "gallery.component.module-panel.field-header.5" }),
                            value: alignEnum.right,
                        },
                    ]}
                />
                <ProFormText name="text" label={intl.formatMessage({ id: "gallery.component.module-panel.field-header.6" })} />
            </ModalForm>
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) =>
    props.content ?
        <p className={props.styling} style={props.content.data} > {props.content.data?.text} </p> : <></>

export const FieldHeader = new ModuleGenerator(EditorField, PresenterField).generate()

