/**
 * Created by Jacob Xie on 2/9/2021
 */

import React, {useEffect, useState} from "react"
import {Tag, Tooltip} from "antd"
import ProList from "@ant-design/pro-list"

import {Editor} from "@/components/Editor"
import {TextEditorPresenter} from "@/components/TextEditor"
import {ArticleToolbar} from "./ArticleToolbar"
import {ArticleCreationModal} from "./ArticleCreationModal"

import {ArticleProps, GenericTag, GenericArticle} from "./data"


export const Article = (props: ArticleProps) => {
  const [pageSize, setPageSize] = useState<number>(props.defaultPageSize || 5)
  const [data, setData] = useState<GenericArticle[]>()
  const [tags, setTags] = useState<GenericTag[]>([])
  const [editable, setEditable] = useState<boolean>(false)

  useEffect(() => {
    props.getTags().then(setTags)
    props.getArticles([pageSize, 0]).then(setData)
  }, [])

  const pagination = {
    defaultPageSize: pageSize,
    showSizeChanger: true,
    onChange: (page: number, pageSize?: number) => {
      const pgn = [pageSize!, page * pageSize!] as [number, number]
      props.getArticles(pgn).then(setData)
    },
    onShowSizeChange: (current: number, size: number) => {
      setPageSize(size)
    }
  }

  return (
    <ProList<GenericArticle>
      pagination={pagination}
      itemLayout="vertical"
      split
      toolBarRender={() => [
        <ArticleToolbar
          tags={tags}
          editable={editable}
          onEdit={setEditable}
          articleCreationOnSubmit={props.modifyArticle}
          tagModificationModal={props.modifyTags}
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
                initialValue={record}
                trigger={c =>
                  <Editor
                    icons={{open: "✏️", close: "✏️"}}
                    onChange={() => c.onClick()}
                  />
                }
                onSubmit={props.modifyArticle}
                tags={tags}
                modalHeight={"70vh"}
                modalWidth={"70vw"}
              /> : <></>
        },
      }}
      headerTitle={props.title}
      dataSource={data}
    />
  )
}

