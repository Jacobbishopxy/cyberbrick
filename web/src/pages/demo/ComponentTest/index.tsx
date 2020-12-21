/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {Button, Space, Tag} from "antd"
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd'


interface Item {
  id: string
  content: React.ReactElement // custom component
}


const getItems = (count: number, remove: (id: string) => void): Item[] =>
  Array.from({length: count}, (v, k) => k).map(k => {

    const id = `item-${k}-${new Date().getTime()}`

    return {
      id,
      content: (
        <Tag
          closable
          onClose={e => {
            e.preventDefault()
            remove(id)
          }}
        >
          {`item ${k}`}
        </Tag>
      )
    }
  })

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: 10,
  overflow: 'auto',
})


export default () => {
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

  const [items, setItems] = useState(getItems(6, removeItem))


  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = reorder(items, result.source.index, result.destination.index)
    setItems(newItems)
  }

  return (
    <Space direction="vertical">
      <Button
        type="primary"
        size="small"
        onClick={() => setItems([...items, ...getItems(1, removeItem)])}
      >
        Add item
      </Button>
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
    </Space>
  )
}

