/**
 * Created by Jacob Xie on 10/15/2020.
 */

import { Button, Tooltip } from "antd"
import { useIntl } from "umi"

import { Emoji } from "@/components/Emoji"
import { Editor } from "@/components/Editor"


export const DragButton = () => {
  const intl = useIntl()
  return (<Tooltip title={intl.formatMessage({ id: "gallery.component.general71" })}>
    <Button
      shape='circle'
      size='small'
      type='link'
      className='draggableHandler'
    >
      <Emoji label="drag" symbol="🧲️️️️️" />
    </Button>
  </Tooltip>)

}

export const TimeSetButton = (props: { show: boolean | undefined, onClick: () => void }) =>
  props.show ?
    <Tooltip title="Date">
      <Button
        shape='circle'
        size='small'
        type='link'
        onClick={props.onClick}
      >
        <Emoji label="date" symbol="🗓️" />
      </Button>
    </Tooltip> : <></>

export const EditButton = (props) => {
  console.log(3737, props)
  return (

    <Editor
      icons={{ open: "⚙️", close: "✔️" }}
      onChange={props.editContent}
      timeSeries={props.timeSeries}
      elementType={props.elementType}
      headName={props.headName}

      content={props.content}
      setContent={props.setContent}
    />
  )
}

export const DeleteButton = (props: { confirmDelete: () => void }) => {
  const intl = useIntl()
  return (<Tooltip title={intl.formatMessage({ id: "gallery.component.general23" })}>
    <Button
      shape='circle'
      size='small'
      type='link'
      onClick={props.confirmDelete}
    >
      <Emoji label="delete" symbol="🗑️️️" />
    </Button>
  </Tooltip>)
}


export const TimePickButton = (props: { onClick: () => void }) => {
  return <Tooltip title="Date">
    <Button
      shape='circle'
      size='small'
      type='link'
      onClick={props.onClick}
    >
      <Emoji label="date" symbol="🗓️" />
    </Button>
  </Tooltip>
}
