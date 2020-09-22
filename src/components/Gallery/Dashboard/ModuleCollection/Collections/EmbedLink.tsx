/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useState } from 'react'
import { Button, Input, Modal } from "antd"

import { ModuleGenerator } from "../ModuleGenerator"
import * as DataType from "../../../DataType"
import { ModuleEditorField, ModulePresenterField } from "../data"

const EditorField = (props: ModuleEditorField) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content>(props.content)

  const handleOk = () => {
    props.updateContent(content)
    setVisible(false)
  }

  const linkOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setContent({
      ...content,
      data: {
        link: e.target.value
      }
    })

  return (
    <div className={ props.styling }>
      <Button
        type='primary'
        shape='round'
        size='small'
        onClick={ () => setVisible(true) }
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
          defaultValue={ content!.data.link }
        />
      </Modal>
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) =>
  <embed className={ props.styling } src={ props.content.data.link }/>

export const EmbedLink = ModuleGenerator({ EditorField, PresenterField })

