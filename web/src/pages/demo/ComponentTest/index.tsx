/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useEffect, useState} from 'react'
import {Tag, Tooltip} from 'antd'
import ProList from '@ant-design/pro-list'
import {Editor} from "@/components/Editor"

// import * as innService from "@/services/inn"


const mock: InnAPI.Update[] = [
  {
    id: "2",
    date: "2021-2-3",
    title: "t2",
    data: "content idk...",
    tags: [
      {
        id: "1",
        name: "dev",
        description: "dev",
        color: "#32a852"
      },
      {
        id: "2",
        name: "prod",
        description: "prod",
        color: "#cc1faf"
      },
    ]
  },
  {
    id: "1",
    date: "2021-2-1",
    title: "t1",
    data: "test test test",
    tags: [
      {
        id: "1",
        name: "dev",
        description: "dev",
        color: "#32a852"
      },
    ]
  },
]

const pagination = {
  defaultPageSize: 5,
  showSizeChanger: true,
}


interface ToolbarProps {
  editable: boolean
  onEdit: (v: boolean) => void
}

const Toolbar = (props: ToolbarProps) => {

  const [visibleNewPost, setVisibleNewPost] = useState(false)
  const [visibleNewTag, setVisibleNewTag] = useState(false)

  return (
    <>
      {
        props.editable ?
          <>
            <Editor onChange={setVisibleNewPost}/>
            <Editor onChange={setVisibleNewTag}/>
          </> : <></>
      }
      <Editor onChange={props.onEdit}/>
    </>
  )
}


export default () => {

  const [data, setData] = useState<InnAPI.Update[]>()
  const [editable, setEditable] = useState<boolean>(false)

  useEffect(() => {
    // innService.getAllUpdate().then(setData)
    setData(mock)
  }, [])

  return (
    <ProList<InnAPI.Update>
      pagination={pagination}
      itemLayout="vertical"
      split
      toolBarRender={() => [
        <Toolbar editable={editable} onEdit={setEditable}/>
      ]}
      metas={{
        title: {
          render: (item, record) =>
            record.title
        },
        description: {
          render: (item, record) =>
            record.tags?.map(t =>
              <Tooltip key={t.id} title={t.description}>
                <Tag color={t.color}>{t.name}</Tag>
              </Tooltip>
            )
        },
        content: {
          render: (item, record) =>
            record.data
        },
        extra: {
          render: (item, record) =>
            editable ? <Editor onChange={(v) => console.log(v)}/> : <></>
        },
      }}
      headerTitle={"更新记录"}
      dataSource={data}
    />
  )
}

