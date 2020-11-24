/**
 * Created by Jacob Xie on 11/20/2020
 */

import React from 'react'
import {Space} from "antd"

export interface SpaceBetweenProps {
  children: React.ReactElement[]
  style?: React.CSSProperties
}

export const SpaceBetween = (props: SpaceBetweenProps) => {

  return (
    <Space style={{...props.style, display: 'flex', justifyContent: 'space-between'}}>
      {props.children}
    </Space>
  )
}

