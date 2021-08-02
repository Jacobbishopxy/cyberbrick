/**
 * Created by Jacob Xie on 9/21/2020.
 */

import React, { useState } from "react"
import { Space, Tag } from "antd"
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { CreationModal } from "./CreationModal"

export interface TextBuilderProps {
    create?: boolean
    text?: string | React.ReactNode
    name: string
    title: string | React.ReactNode
    onSubmit: (value: string) => void
    colorSelector: boolean
    categoryTypeSelector: string[]
}

export const TagBuildModal = (props: TextBuilderProps) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [newText, setNewText] = useState<string>()

    const onSubmit = () => {
        if (newText) props.onSubmit(newText)
        setModalVisible(false)
    }

    const edit = () =>
        <Space>
        </Space>

    const nonEdit = () =>
        props.create ?
            <Tag
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
            >
                {props.title}
            </Tag> :
            <Space>
                {props.title}
                <EditOutlined
                    onClick={() => setModalVisible(true)}
                />
            </Space>

    return <>{modalVisible ? edit() : nonEdit()}
        <CreationModal
            name={props.name}
            title={props.title as string}
            visible={modalVisible}
            onSubmit={onSubmit}
            onCancel={() => setModalVisible(false)}
            colorSelector={props.colorSelector}
            isTypeSelector={true}
            typeSelector={props.categoryTypeSelector}
        />
    </>

}

TagBuildModal.defaultProps = {
    create: false,
    colorSelector: false
} as Partial<TextBuilderProps>

