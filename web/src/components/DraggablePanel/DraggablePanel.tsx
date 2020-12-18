/**
 * Created by Jacob Xie on 12/17/2020
 */

import React, {useEffect, useState} from 'react'
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd'


export interface DraggableElement {
  id: string
}

export type DraggableElementType<T extends DraggableElement> = React.ReactElement<T>

const reorder = <T extends DraggableElement>(data: DraggableElementType<T>[], startIndex: number, endIndex: number) => {
  const result = Array.from(data)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}


export interface DraggablePanelProps<T extends DraggableElement> {
  editable: boolean
  children: DraggableElementType<T>[]
  onChange?: (ids: string[]) => void
  direction?: "horizontal" | "vertical" | undefined
}

export const DraggablePanel = <T extends DraggableElement>(props: DraggablePanelProps<T>) => {
  const [items, setItems] = useState<DraggableElementType<T>[]>(props.children)

  useEffect(() => {
    if (props.onChange) props.onChange(items.map(i => i.props.id))
  }, [items])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = reorder(items, result.source.index, result.destination.index)
    setItems(newItems)
  }

  return props.editable ?
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction={props.direction || "horizontal"}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            style={props.direction === "vertical" ? {} : {display: "flex", overflow: "auto"}}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.props.id} draggableId={item.props.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext> :
    <div>
      {props.children}
    </div>
}

