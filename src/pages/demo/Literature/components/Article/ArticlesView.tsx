/**
 * Created by Jacob Xie on 8/16/2020.
 */

import { List, Divider, Space } from "antd"
import React, { useEffect, useState } from "react"
import _ from "lodash"
import moment from "moment"
import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"

import { TagsView } from "../Tag/TagsView"
import { NewArticleForm } from "./NewArticleForm"
import * as propsData from "../data"


const getExcludeTags = (all: API.Tag[], have: API.Tag[]): API.Tag[] =>
  _.differenceWith(all, have, _.isEqual)

const dateFormatter = (d: string) =>
  moment(d).utc(false).format("YYYY-MM-DD HH:mm:ss")

const SingleArticleView = (props: propsData.SingleArticleViewProps) => {

  const [article, setArticle] = useState<API.Article>(props.article)
  const [articleEditable, setArticleEditable] = useState<boolean>(false)

  useEffect(() => {
    setArticle(props.article)
  }, [props.article])

  const doneEdit = () => {
    if (article && props.articleOnModify) props.articleOnModify(article)
    setArticleEditable(false)
  }

  const doneDelete = () => {
    if (article && props.articleOnDelete) props.articleOnDelete(article.id!)
    setArticleEditable(false)
  }

  const articleTextOnChange = (text: string) =>
    setArticle({ ...article, text })

  const articleTagOnChange = (tags: API.Tag[]) =>
    setArticle({ ...article, tags })

  const footer = (
    <div style={ { display: 'flex', justifyContent: 'space-between' } }>
      <span>ID: { article.id }</span>
      <span>Version: { article.version }</span>
    </div>
  )

  const displayView = (
    <>
      <List.Item.Meta
        title={
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <div>{ article.title }</div>
            <div>{ dateFormatter(article.date) }</div>
          </div>
        }
        description={
          <div>
            <TextEditorPresenter
              content={ article.text }
            />
            <br/>
            <TagsView
              tags={ article.tags! }
              editable={ false }
            />
            <br/>
            <br/>
            { footer }
          </div>
        }
        style={ { marginRight: 10 } }
      />
      {
        props.editable ?
          <a
            onClick={ () => setArticleEditable(true) }
            style={ { height: 20 } }
          >
            Edit
          </a> :
          <div/>
      }
    </>
  )

  const editView = (
    <>
      <List.Item.Meta
        title={
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <div>{ article.title }</div>
            <div>{ dateFormatter(article.date) }</div>
          </div>
        }
        description={
          <div>
            <TextEditorModifier
              onChange={ articleTextOnChange }
              content={ article.text }
            />
            <br/>
            <TagsView
              isTagPanel={ false }
              tags={ article.tags! }
              tagsExcluded={ getExcludeTags(props.unionTags, article.tags!) }
              editable
              tagsOnChange={ articleTagOnChange }
            />
            <br/>
            <br/>
            { footer }
          </div>
        }
        style={ { marginRight: 10 } }
      />
      <Space direction="vertical">
        <a onClick={ doneEdit }>Done</a>
        <a style={{color: "red"}} onClick={ doneDelete }>Delete</a>
      </Space>
    </>
  )

  return (
    <List.Item key={ article.id } style={ { display: 'flex', justifyContent: 'space-between' } }>
      { articleEditable && props.editable ? editView : displayView }
    </List.Item>
  )
}


export const ArticlesView = (props: propsData.ArticlesViewProps) => {

  return (
    <>
      <List
        itemLayout="vertical"
        dataSource={ props.articles }
        renderItem={ item =>
          <SingleArticleView
            unionTags={ props.unionTags }
            article={ item }
            editable={ props.editable }
            articleOnModify={ props.articleOnCreate }
            articleOnDelete={ props.articleOnDelete }
          />
        }
        locale={ { emptyText: "Empty" } }
      />
      {
        props.editable ?
          <div>
            <Divider/>
            <NewArticleForm
              categoryName={ props.categoryName }
              tags={ props.unionTags }
              onSubmit={ props.articleOnCreate! }
            />
          </div> :
          <></>
      }
    </>
  )
}

