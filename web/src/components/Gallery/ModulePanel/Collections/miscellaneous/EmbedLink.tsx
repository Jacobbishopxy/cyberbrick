/**
 * Created by Jacob Xie on 9/22/2020.
 */

import { useState } from "react"
import { Button } from "antd"
import { useIntl } from "umi"

import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import { ModalForm, ProFormText } from "@ant-design/pro-form"


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
        trigger={<Button type="primary">{intl.formatMessage({ id: "gallery.component.general13" })}</Button>}
        initialValues={{ link: content?.data?.link }}
        onFinish={onSubmit}
      >
        <ProFormText name="link" label={intl.formatMessage({ id: "gallery.component.type.link" })} />
      </ModalForm>
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <embed className={props.styling} src={props.content?.data?.link} /> : <embed className={props.styling} />

export const EmbedLink = new ModuleGenerator(EditorField, PresenterField).generate()

