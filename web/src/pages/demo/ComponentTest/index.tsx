/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {Space} from "antd"

import {EditableTagPanel, SearchableTags} from "@/components/Gallery/Tag"
import {Editor} from "@/components/Editor"


interface Data {
  name: string
  description: string
}

const defaultData: Data[] = [
  {
    name: "Scala",
    description: "FP + OOP"
  }
]

export default () => {

  const [editable, setEditable] = useState<boolean>(false)
  const [data, setData] = useState<Data[]>(defaultData)

  const elementOnCreate = (v: Data) =>
    setData([...data, v])

  const elementOnRemove = (v: string) =>
    setData(data.filter(d => d.name !== v))

  return (
    <Space direction="vertical">
      <Editor onChange={setEditable}/>
      <EditableTagPanel
        data={data}
        editable={editable}
        elementOnCreate={elementOnCreate}
        elementOnRemove={elementOnRemove}
      />
      <SearchableTags
        searchable={editable}
        data={data}
        elementOnSelect={d => console.log(d)}
      />
    </Space>
  )
}

