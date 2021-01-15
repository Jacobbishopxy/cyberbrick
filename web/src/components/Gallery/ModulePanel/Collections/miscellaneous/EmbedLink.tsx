/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, {useState} from 'react'
import {Button} from "antd"

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {ModalForm, ProFormText} from "@ant-design/pro-form"


const EditorField = (props: ModuleEditorField) => {
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
        title="Place your link below"
        trigger={<Button type="primary">Update</Button>}
        initialValues={{
          link: content && content.data && content.data.link ?
            content.data.link : undefined
        }}
        onFinish={onSubmit}
      >
        <ProFormText name="link" label="Link"/>
      </ModalForm>
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content && props.content.data && props.content.data.link ?
    <embed className={props.styling} src={props.content.data.link}/> : <></>

export const EmbedLink = new ModuleGenerator(EditorField, PresenterField).generate()

