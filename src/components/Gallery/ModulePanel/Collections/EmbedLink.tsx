/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useState } from 'react'
import { Button, Input, Space } from "antd"

import { ModuleGenerator } from "../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../Generator/data"
import * as DataType from "../../GalleryDataType"


const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const handleOk = () => {
    if (content) props.updateContent(content)
  }

  const linkOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (content) setContent({
      ...content,
      data: { link: e.target.value }
    })
    else setContent({
      date: DataType.today(),
      data: { link: e.target.value }
    })
  }

  return (
    <div className={ props.styling }>
      <Space direction="vertical" style={ { position: "relative", top: "40%" } }>
        Please enter the link below:
        <Input
          style={ { width: 400 } }
          placeholder='Link'
          allowClear
          onBlur={ linkOnChange }
          defaultValue={ content ? content.data.link : null }
        />
        <Button
          type='primary'
          shape='round'
          size='small'
          onClick={ handleOk }
        >
          Save
        </Button>
      </Space>
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <embed className={ props.styling } src={ props.content.data.link }/> : <></>

export const EmbedLink = new ModuleGenerator(EditorField, PresenterField).generate()

