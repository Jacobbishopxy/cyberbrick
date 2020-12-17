/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {Tag} from "antd"
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd'


interface Item {
  id: string
  content: React.ReactElement // custom component
}


const getItems = (count: number): Item[] =>
  Array.from({length: count}, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: <Tag>{`item ${k}`}</Tag>
  }))

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
})


export default () => {

  const [items, setItems] = useState(getItems(6))

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = reorder(items, result.source.index, result.destination.index)
    setItems(newItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

