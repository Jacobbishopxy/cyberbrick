/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useState } from 'react'
import { Button, Input, Modal } from "antd"
import moment from "moment"

import { ModuleGenerator } from "../ModuleGenerator"
import * as DataType from "../../../GalleryDataType"
import { ModuleEditorField, ModulePresenterField } from "../data"

const EditorField = (props: ModuleEditorField) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const handleOk = () => {
    if (content) props.updateContent(content)
    setVisible(false)
  }

  const linkOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (content) setContent({
      ...content,
      data: { link: e.target.value }
    })
    else setContent({
      date: moment().format(DataType.dateFormat),
      data: { link: e.target.value }
    })
  }

  return (
    <div className={ props.styling }>
      <Button
        type='primary'
        shape='round'
        size='small'
        onClick={ () => setVisible(true) }
        style={ { position: "relative", top: "40%" } }
      >
        Click here to modify
      </Button>
      <Modal
        title='Please enter link below:'
        visible={ visible }
        onOk={ handleOk }
        onCancel={ () => setVisible(false) }
      >
        <Input
          placeholder='Link'
          allowClear
          onBlur={ linkOnChange }
          defaultValue={ content ? content.data.link : null }
        />
      </Modal>
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <embed className={ props.styling } src={ props.content.data.link }/> : <></>

export const EmbedLink = new ModuleGenerator(EditorField, PresenterField).generate()

