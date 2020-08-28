/**
 * Created by Jacob Xie on 8/16/2020.
 */

import { List, Divider } from "antd"
import React from "react"

import { NewArticleForm } from "./NewArticleForm"
import { ArticlePanelProps } from "./data"
import { SingleArticle } from "./SingleArticle"


export const ArticlePanel = (props: ArticlePanelProps) =>
  <>
    <List
      itemLayout="vertical"
      dataSource={ props.articles }
      renderItem={ item =>
        <SingleArticle
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

