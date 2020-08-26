/**
 * Created by Jacob Xie on 8/26/2020.
 */

import React from "react"
import { Card, Select } from "antd"

import { ControllerProps } from "./data"


export const Controller = (props: ControllerProps) => {
  return (
    <Card
      size="small"
    >
      <Select
        style={ { width: 200 } }
        onChange={props.onSelect}
      >
        {
          props.categoryNames.map(n =>
            <Select.Option key={ n } value={ n }>
              { n }
            </Select.Option>
          )
        }
      </Select>
    </Card>
  )
}
