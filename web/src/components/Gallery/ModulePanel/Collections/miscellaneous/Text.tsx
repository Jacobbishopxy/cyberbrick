/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, {useState} from 'react'
import {message} from "antd"

import {TextEditorModifier, TextEditorPresenter} from "@/components/TextEditor"
import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"

const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const onChangeContent = (value: string) => {
    const ctt = content ?
      {...content, data: {text: value}} :
      {date: DataType.today(), data: {text: value}}
    setContent(ctt)
  }

  const onSaveContent = () => {
    if (content) {
      props.updateContent(content)
      message.success("Saving content succeed!")
    }
  }

  return (
    <TextEditorModifier
      onChange={onChangeContent}
      content={content && content.data ? content.data.text : null}
      onSave={onSaveContent}
      saveButton
      styling={props.styling}
    />
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content && props.content.data && props.content.data.text ?
    <TextEditorPresenter
      content={props.content.data.text}
      styling={props.styling}
    /> : <></>

export const Text = new ModuleGenerator(EditorField, PresenterField, true).generate()

