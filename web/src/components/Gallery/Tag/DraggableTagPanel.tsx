/**
 * Created by Jacob Xie on 12/17/2020
 */

import {useEffect, useState} from "react"
import {Tag} from "antd"
import _ from "lodash"

import {DraggablePanel} from "@/components/DraggablePanel/DraggablePanel"

import {DraggableTagPanelProps, GenericDataInput} from "./data"


export const DraggableTagPanel = <T extends GenericDataInput>(props: DraggableTagPanelProps<T>) => {

  const [items, setItems] = useState<T[]>(props.data.map(i => ({...i, id: i.name})))

  useEffect(() => props.elementOnChange(items), [items])

  const onChange = (ids: string[]) => {
    const newItems = _.sortBy(items, i => ids.indexOf(i.name))
    setItems(newItems)
  }

  return (
    <DraggablePanel
      editable={props.editable}
      onChange={onChange}
    >
      {
        items.map(i => <Tag key={i.name} id={i.name}>{i.name}</Tag>)
      }
    </DraggablePanel>
  )
}

