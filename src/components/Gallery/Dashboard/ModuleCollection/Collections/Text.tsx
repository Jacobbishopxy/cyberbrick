/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, { useState } from 'react'
import { message } from "antd"
import moment from "moment"

import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"
import { ModuleGenerator } from "../ModuleGenerator"
import * as DataType from "../../../DataType"
import { ModuleEditorField, ModulePresenterField } from "../data"

const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const onChangeContent = (value: string) => {
    const ctt = content ?
      { ...content, data: { text: value } } :
      { date: moment().format(DataType.dateFormat), data: { text: value } }
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
      onChange={ onChangeContent }
      content={ content ? content.data.text : null }
      onSave={ onSaveContent }
      saveButton
      styling={ props.styling }
    />
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <TextEditorPresenter
      content={ props.content.data.text }
      styling={ props.styling }
    /> : <></>

export const Text = new ModuleGenerator(EditorField, PresenterField, true).generate()

