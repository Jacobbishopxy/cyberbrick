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
          <Col offset={2} span={16} style={{paddingRight:5}}>
            <ManualContent/>
          </Col>
          <Col offset={2} span={4} style={{paddingLeft:5}}>
            <ManualAnchor/>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  )
}

