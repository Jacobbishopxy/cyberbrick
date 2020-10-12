/**
 * Created by Jacob Xie on 10/12/2020.
 */

import React, { useEffect, useState } from 'react'
import { Select, Space } from "antd"
import { SaveTwoTone, SettingTwoTone } from '@ant-design/icons'

import * as DataType from "../../GalleryDataType"
import { Editor } from "../../Misc/Editor"


export interface ControllerProps {
  categoryNames: string[]
  categoryOnSelect: (categoryName: string) => Promise<DataType.Mark[] | undefined>
  markOnSelect: (name: string) => void
  onEdit: (value: boolean) => void
}

export const Controller = (props: ControllerProps) => {

  const [edit, setEdit] = useState<boolean>(false)
  const [marks, setMarks] = useState<DataType.Mark[]>([])

  useEffect(() => props.onEdit(edit), [edit])

  const categoryOnSelect = (value: string) =>
    props.categoryOnSelect(value).then(res => {
      if (res) setMarks(res)
    })

  return (
    <div style={ { display: 'flex', justifyContent: 'space-between' } }>
      <Space>
        <Select
          style={ { width: 120 } }
          onSelect={ categoryOnSelect }
          size="small"
          placeholder="Category"
        >
          {
            props.categoryNames.map(n =>
              <Select.Option key={ n } value={ n }>{ n }</Select.Option>
            )
          }
        </Select>
        <Select
          style={ { width: 120 } }
          onSelect={ props.markOnSelect }
          disabled={ marks.length === 0 }
          size="small"
          placeholder="Mark"
        >
          {
            marks.map(m =>
              <Select.Option key={ m.id } value={ m.name }>{ m.name }</Select.Option>
            )
          }
        </Select>
      </Space>

      <div>
        <Editor // todo: current page configuration, e.g.: number of contents shown in one page
          icons={ {
            open: <SettingTwoTone style={ { fontSize: 20 } }/>,
            close: <SaveTwoTone style={ { fontSize: 20 } }/>
          } }
          editable={ edit }
          setEditable={ () => setEdit(!edit) }
        />
      </div>
    </div>
  )
}

