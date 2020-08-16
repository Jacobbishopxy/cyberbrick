import * as service from "@/services/targetTag"
import { List } from "antd"
import { TagsView } from "@/pages/demo/TargetTag/components/TagsView"
import React from "react"

/**
 * Created by Jacob Xie on 8/16/2020.
 */

interface TargetsViewProps {
  targets: service.Target[]
  tagClosable: boolean
}

export const TargetsView = (props: TargetsViewProps) =>
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
              <TagsView
                tags={ item.tags! }
                editable={ props.tagClosable }
              />
            </div>
          }
          key={ item.id }
        />
      </List.Item>
    ) }
  />
