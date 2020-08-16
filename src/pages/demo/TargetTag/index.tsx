import { PageHeaderWrapper } from '@ant-design/pro-layout'
import React, { useState, useEffect } from 'react'
import { Tag, Tooltip, List, Row, Col } from 'antd'

import * as service from '@/services/targetTag'


const TagsView = (props: { tags: service.Tag[] }) =>
  <>
    { props.tags.map(t =>
      <Tooltip title={ t.description } key={ t.name }>
        <Tag>{ t.name }</Tag>
      </Tooltip>
    ) }
  </>

const TargetsView = (props: { targets: service.Target[] }) =>
  <List
    itemLayout="vertical"
    dataSource={ props.targets }
    renderItem={ item => (
      <List.Item>
        <List.Item.Meta
          title={ item.title }
          description={
            <div>
              <div>{ item.text }</div>
              <br/>
              <TagsView tags={ item.tags! }/>
            </div>
          }
          key={ item.id }
        />
      </List.Item>
    ) }
  />


export default () => {

  const [tags, setTags] = useState<service.Tag[]>([])
  const [targets, setTargets] = useState<service.Target[]>([])

  useEffect(() => {

    service.getTags(false).then(res => setTags(res))
    service.getTargets().then(res => setTargets(res))

  }, [])


  return (
    <PageHeaderWrapper>
      <Row>
        <Col span={ 16 } offset={ 2 }>
          <div style={ { fontSize: 25 } }>Targets:</div>
          <br/>
          <TargetsView targets={ targets }/>
        </Col>
        <Col>
          <div style={ { fontSize: 25 } }>Tags:</div>
          <br/>
          <TagsView tags={ tags }/>
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
};
