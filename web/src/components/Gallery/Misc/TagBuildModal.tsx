/**
 * Created by Jacob Xie on 9/21/2020.
 */

import React, { useState } from "react"
import { Space, Tag } from "antd"
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { CreationModal, CreationModalValue } from "./CreationModal"

export interface TextBuilderProps {
    create?: boolean
    text?: string | React.ReactNode
    name: string
    title: string | React.ReactNode
    onSubmit: (name: string, type: string, description?: string) => void
    colorSelector: boolean
    categoryTypeSelector: string[]
}

const DEFAULT_TYPE = "dashboard"

export const TagBuildModal = (props: TextBuilderProps) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const onSubmit = (value: CreationModalValue) => {
        props.onSubmit(value.name, value.type || DEFAULT_TYPE, value.description)
        setModalVisible(false)
    }


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

    return <>
        {nonEdit()}
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

