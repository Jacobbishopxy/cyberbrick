/**
 * Created by Jacob Xie on 1/19/2021
 */

import React from 'react'
import {PageContainer} from "@ant-design/pro-layout"
import {Card, Col, Row} from "antd"

import {ManualAnchor} from "./ManualAnchor"
import {ManualContent} from "./ManualContent"


export default () => {

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={20}>
            <ManualContent/>
          </Col>
          <Col span={4}>
            <ManualAnchor/>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  )
}

