/**
 * Created by Jacob Xie on 8/26/2020.
 */


import React, { useState } from 'react'
import { Row, Col, Card } from 'antd'

import { TagsView } from "./TagsView"
import { ArticlesView } from "./Article/ArticlesView"
import { Editor } from "./Editor"
import { ContentProps, Editable } from "./data"


export const Content = (props: ContentProps) => {

  const [editable, setEditable] = useState<Editable>({ article: false, tag: false })

  return (
    <>
      <Row>
        <Col span={ 17 }>
          <Card
            title={ <div style={ { fontSize: 25 } }>Articles</div> }
            extra={
              <Editor
                editable={ editable.article }
                setEditable={ (e: boolean) => setEditable({ ...editable, article: e }) }
              />
            }
            size="small"
          >
            <ArticlesView
              categoryName={ props.category.name }
              articles={ props.articles }
              unionTags={ props.category.unionTags! }
              editable={ editable.article }
              articleOnCreate={ props.articlePanelUpdate }
              articleOnDelete={ props.articlePanelDelete }
            />
          </Card>
        </Col>

        <Col span={ 7 }>
          <Card
            title={ <div style={ { fontSize: 25 } }>Tags</div> }
            extra={
              <Editor
                editable={ editable.tag }
                setEditable={ (e: boolean) => setEditable({ ...editable, tag: e }) }
              />
            }
            size="small"
          >
            <TagsView
              category={ props.category }
              tags={ props.category.unionTags }
              editable={ editable.tag }
              tagOnCreate={ props.tagPanelUpdate }
              tagOnRemove={ props.tagPanelDelete }
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
