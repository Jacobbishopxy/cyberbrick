/**
 * Created by Jacob Xie on 10/15/2020.
 */

import { Button, Tooltip } from "antd"

import { Emoji } from "@/components/Emoji"
import { Editor } from "@/components/Editor"


export const DragButton = () =>
    <Tooltip title='Drag'>
        <Button
            shape='circle'
            size='small'
            type='link'
            className='draggableHandler'
        >
            <Emoji label="drag" symbol="🧲️️️️️" />
        </Button>
    </Tooltip>

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
    console.log(3737, props.setContent)
    return (
        <Tooltip title="Edit">
            <Editor
                icons={{ open: "⚙️", close: "✔️" }}
                onChange={props.editContent}
                timeSeries={props.timeSeries}
                elementType={props.elementType}
                headName={props.headName}

                content={props.content}
                setContent={props.setContent}
            />
        </Tooltip>
    )
}

export const DeleteButton = (props: { confirmDelete: () => void }) =>
    <Tooltip title="Delete">
        <Button
            shape='circle'
            size='small'
            type='link'
            onClick={props.confirmDelete}
        >
            <Emoji label="delete" symbol="🗑️️️" />
        </Button>
    </Tooltip>

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
