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
        props.updateContent(ctt)

        return true
    }

    return (
        <div className={props.styling}>
            <ModalForm
                title={intl.formatMessage({ id: "gallery.component.module-panel.miscellaneous.embed-link1" })}
                trigger={<Button type="primary">Update</Button>}
                initialValues={{ link: content?.data?.link }}
                onFinish={onSubmit}
            >
                <ProFormSelect
                    name="fontSize"
                    label="fontSize"
                    options={fontList.map(size => { return { value: size, label: size } })}
                    fieldProps={{
                        optionItemRender(item) {
                            return <p style={{ fontSize: item.value }}>text</p>
                        }
                    }}
                />
                <ProFormRadio.Group
                    name="textAlign"
                    label="alignment"
                    options={[
                        {
                            label: 'left',
                            value: 'left',
                        },
                        {
                            label: 'center',
                            value: 'center',
                        },
                        {
                            label: 'right',
                            value: 'right',
                        },
                    ]}
                />
                <ProFormText name="text" label="text" />
            </ModalForm>
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) =>
    props.content ?
        <p className={props.styling} style={props.content.data} > {props.content.data?.text} </p> : <></>

export const FieldHeader = new ModuleGenerator(EditorField, PresenterField).generate()

