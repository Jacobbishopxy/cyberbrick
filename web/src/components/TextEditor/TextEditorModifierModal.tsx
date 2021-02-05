/**
 * Created by Jacob Xie on 2/4/2021
 */

import React, {useState} from "react"
import {message, Modal} from "antd"
import {useIntl} from "umi"

import {TextEditorModifier} from "./TextEditorModifier"


export interface TextEditorModifierModalProps {
  visible: boolean
  onSubmit: (value: string) => void
  onCancel: () => void
  modalWidth?: string | number
  modalHeight?: string | number
}

export const TextEditorModifierModal = (props: TextEditorModifierModalProps) => {
  const intl = useIntl()
  const [data, setData] = useState<string>()

  const onSubmit = () => {
    if (data) props.onSubmit(data)
    else message.warn("Please enter your content!")
  }

  console.log("props.modalHeight", props.modalHeight)

  return props.visible ?
    <Modal
      title={intl.formatMessage({id: "component.textEditor.textEditorModifierModal.title"})}
      visible={props.visible}
      onOk={onSubmit}
      onCancel={props.onCancel}
      maskClosable={false}
      width={props.modalWidth}
      bodyStyle={{height: props.modalHeight}}
    >
      <TextEditorModifier
        onChange={setData}
        content={data}
        style={{height: props.modalHeight ? `calc(${props.modalHeight} - 90px)` : undefined}}
      />

    </Modal> : <></>
}

