/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useEffect, useState} from "react"
import {Tag, Tooltip} from "antd"
import ProList from "@ant-design/pro-list"

import {Editor} from "@/components/Editor"
import {TextEditorPresenter} from "@/components/TextEditor"
import {ArticleCreationModal, TagModificationModal} from "@/components/Article"
import {GenericTag} from "@/components/Article/data"

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

const mockTags: InnAPI.Tag[] = [
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

const pagination = {
  defaultPageSize: 5,
  showSizeChanger: true,
}


interface ToolbarProps {
  editable: boolean
  onEdit: (v: boolean) => void
  articleCreationOnSubmit: (v: any) => void
  tagModificationModal: (v: any) => void
}

const Toolbar = (props: ToolbarProps) => {

  return (
    <>
      {
        props.editable ?
          <>
            <ArticleCreationModal
              trigger={c =>
                <Editor
                  icons={{open: "🧾", close: "🧾"}}
                  onChange={() => c.onClick()}
                />
              }
              onSubmit={props.articleCreationOnSubmit}
              tags={mockTags}
              modalHeight={"70vh"}
              modalWidth={"70vw"}
            />

            <TagModificationModal
              trigger={c =>
                <Editor
                  icons={{open: "🏷️", close: "🏷️"}}
                  onChange={() => c.onClick()}
                />
              }
              onSubmit={props.tagModificationModal}
              tags={mockTags}
            />
          </> : <></>
      }
      <Editor
        icons={{open: "⚙️", close: "✔️"}}
        onChange={props.onEdit}
      />
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
        <Toolbar
          editable={editable}
          onEdit={setEditable}
          articleCreationOnSubmit={v => console.log(v)}
          tagModificationModal={v => console.log(v)}
        />
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
            <TextEditorPresenter content={record.data}/>
        },
        extra: {
          render: (item, record) =>
            editable ?
              <ArticleCreationModal
                initialValue={{tags: record.tags as GenericTag[], value: record.data}}
                trigger={c =>
                  <Editor
                    icons={{open: "✏️", close: "✏️"}}
                    onChange={() => c.onClick()}
                  />
                }
                onSubmit={v => console.log(v)}
                tags={mockTags}
                modalHeight={"70vh"}
                modalWidth={"70vw"}
              /> : <></>
        },
      }}
      headerTitle={"更新记录"}
      dataSource={data}
    />
  )
}

