/**
 * Created by Jacob Xie on 2/9/2021
 */

import {useEffect, useState} from "react"
import {Modal, Space, Tag, Tooltip, Typography} from "antd"
import {ExclamationCircleOutlined} from "@ant-design/icons"
import ProList from "@ant-design/pro-list"
import {useIntl} from "umi"
import moment from "moment"

import {Editor} from "@/components/Editor"
import {TextEditorPresenter} from "@/components/TextEditor"
import {ArticleToolbar} from "./ArticleToolbar"
import {ArticleCreationModal} from "./ArticleCreationModal"

import {ArticleProps, GenericTag, GenericArticle} from "./data"


interface ArticleEditableProps {
  editable: boolean
  initialArticle: GenericArticle
  tags: GenericTag[]
  onSubmit: (value: GenericArticle) => void
  onDelete: (id: string) => void
}

const ArticleEditable = (props: ArticleEditableProps) => {
  const intl = useIntl()
  const configDelete = () =>
    Modal.confirm({
      title: intl.formatMessage({id: "component.article.articleEditable.confirmDelete"}),
      icon: <ExclamationCircleOutlined/>,
      onOk: () => props.onDelete(props.initialArticle.id)
    })

  return props.editable ?
    <>
      <ArticleCreationModal
        initialValue={props.initialArticle}
        trigger={c =>
          <Editor
            icons={{open: "✏️", close: "✏️"}}
            onChange={() => c.onClick()}
          />
        }
        onSubmit={props.onSubmit}
        tags={props.tags}
        modalHeight={"70vh"}
        modalWidth={"70vw"}
      />
      <Editor
        icons={{open: "🗑️", close: "🗑️"}}
        onChange={() => configDelete()}
      />
    </> : <></>
}


export const Article = (props: ArticleProps) => {
  const [pageSize, setPageSize] = useState<number>(props.defaultPageSize || 5)
  const [data, setData] = useState<GenericArticle[]>()
  const [tags, setTags] = useState<GenericTag[]>([])
  const [editable, setEditable] = useState<boolean>(false)

  useEffect(() => {
    props.getTags().then(setTags)
    props.getArticles([0, pageSize]).then(setData)
  }, [])

  const pagination = {
    defaultPageSize: pageSize,
    showSizeChanger: true,
    onChange: (page: number, pageSize?: number) => {
      const pgn = [(page - 1) * pageSize!, pageSize!] as [number, number]
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
            <Space>
              <Typography.Text strong>
                {record.title}
              </Typography.Text>
              <Typography.Text type="secondary">
                {moment(record.date).format("YYYY-MM-DD")}
              </Typography.Text>
            </Space>
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
            <ArticleEditable
              editable={editable}
              initialArticle={record}
              tags={tags}
              onSubmit={props.modifyArticle}
              onDelete={props.deleteArticle}
            />
        },
      }}
      headerTitle={props.title}
      dataSource={data}
    />
  )
}

