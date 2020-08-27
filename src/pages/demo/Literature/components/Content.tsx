/**
 * Created by Jacob Xie on 8/26/2020.
 */


import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Card, Switch } from 'antd'
import { CloseOutlined, MonitorOutlined } from '@ant-design/icons'

import { TagsView } from "./Tag/TagsView"
import { ArticlesView } from "./Article/ArticlesView"
import { Editor } from "./Misc/Editor"
import { EditableContext } from "../Literature"
import { ContentProps, Editable } from "./data"


export const SearchableContext = React.createContext<boolean>(false)

export const Content = (props: ContentProps) => {
  const globalEditable = useContext(EditableContext)
  const [editable, setEditable] = useState<Editable>({ article: false, tag: false })
  const [tagSearchable, setTagSearchable] = useState<boolean>(false)

  useEffect(() => {
    setEditable({ article: false, tag: false })
    setTagSearchable(false)
  }, [globalEditable])

  return (
    <>
      <Row>
        <Col span={ 17 }>
          <Card
            title={ <div style={ { fontSize: 25 } }>Articles</div> }
            extra={
              globalEditable ?
                <Editor
                  editable={ editable.article }
                  setEditable={ (e: boolean) => setEditable({ ...editable, article: e }) }
                /> : <></>
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
              globalEditable ?
                <Editor
                  editable={ editable.tag }
                  setEditable={ (e: boolean) => setEditable({ ...editable, tag: e }) }
                /> :
                <Switch
                  onChange={ setTagSearchable }
                  checkedChildren={ <MonitorOutlined/> }
                  unCheckedChildren={ <CloseOutlined/> }
                />
            }
            size="small"
          >
            <SearchableContext.Provider value={ tagSearchable }>
              <TagsView
                category={ props.category }
                tags={ props.category.unionTags }
                editable={ editable.tag }
                tagOnCreate={ props.tagPanelUpdate }
                tagOnRemove={ props.tagPanelDelete }
                onSelectTags={ props.tagPanelSearch }
              />
            </SearchableContext.Provider>
          </Card>
        </Col>
      </Row>
    </>
  )
}
