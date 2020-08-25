/**
 * Created by Jacob Xie on 8/16/2020.
 */

import { PageHeaderWrapper } from '@ant-design/pro-layout'
import React, { useState, useEffect } from 'react'
import { Row, Col, Card } from 'antd'

import * as service from '@/services/literature'

import { TagsView } from "./components/TagsView"
import { ArticlesView } from "./components/ArticlesView"
import { Editor } from "./components/Editor"


interface Editable {
  target: boolean
  tag: boolean
}

interface TriggerEdit {
  target: number
  tag: number
}


// todo: service updated
export default () => {

  const [editable, setEditable] = useState<Editable>({ target: false, tag: false })
  const [triggerEdit, setTriggerEdit] = useState<TriggerEdit>({ target: 0, tag: 0 })
  const [tags, setTags] = useState<API.Tag[]>([])
  const [articles, setArticles] = useState<API.Article[]>([])

  useEffect(() => {
    service.getTags(false).then(res => setTags(res))
  }, [triggerEdit.tag])

  useEffect(() => {
    service.getTargets().then(res => setArticles(res))
  }, [triggerEdit.target])

  const triggerTag = () =>
    setTriggerEdit({ ...triggerEdit, tag: triggerEdit.tag + 1 })

  const triggerTarget = () =>
    setTriggerEdit({ tag: triggerEdit.tag + 1, target: triggerEdit.target + 1 })


  const tagPanelUpdate = (ts: API.Tag) =>
    service
      .saveTag(ts)
      .then(triggerTag)


  const tagPanelDelete = (name: string) =>
    service
      .deleteTag(name)
      .then(triggerTag)

  const targetPanelUpdate = (target: API.Article) =>
    service
      .saveTarget(target)
      .then(triggerTarget)

  const targetPanelDelete = (id: number) =>
    service
      .deleteTarget(id)
      .then(triggerTarget)

  return (
    <PageHeaderWrapper>
      <Row>
        <Col span={ 17 }>
          <Card
            title={ <div style={ { fontSize: 25 } }>Targets</div> }
            extra={
              <Editor
                editable={ editable.target }
                setEditable={ (e: boolean) => setEditable({ ...editable, target: e }) }
              />
            }
          >
            <ArticlesView
              articles={ articles }
              tags={ tags }
              editable={ editable.target }
              articleOnCreate={ targetPanelUpdate }
              articleOnDelete={ targetPanelDelete }
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
          >
            <TagsView
              tags={ tags }
              editable={ editable.tag }
              tagOnCreate={ tagPanelUpdate }
              tagOnRemove={ tagPanelDelete }
            />
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
};
