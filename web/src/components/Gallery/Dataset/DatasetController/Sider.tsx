/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, { useState } from "react"
import { Button, Dropdown, Input, List, Menu, Modal, Space } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, ReadOutlined, SearchOutlined } from "@ant-design/icons"
import { FormattedMessage, useIntl } from "umi"

import { QuerySelectorModal } from "@/components/Gallery/Dataset"
import * as DataType from "@/components/Gallery/GalleryDataType"


interface RenameTableModalProps {
    intl: any
    visible: boolean
    originalName: string
    onOk: (replacement: string) => void
    onCancel: () => void
}

const RenameTableModal = (props: RenameTableModalProps) => {
    const [input, setInput] = useState(props.originalName)

    return (
        <Modal
            visible={props.visible}
            title={props.intl.formatMessage({ id: "gallery.component.dataset-controller-sider1" })}
            onOk={() => props.onOk(input)}
            onCancel={props.onCancel}
        >
            <Input defaultValue={props.originalName} onChange={e => setInput(e.target.value)} />
        </Modal>
    )
}

interface ListRenderProps {
    id?: string
    item: string
    storagesOnFetch: () => Promise<DataType.StorageSimple[]>
    storageOnSelect: (id: string) => Promise<string[]>
    tableOnClick: (name: string) => Promise<any>
    tableOnSelect: (name: string) => Promise<string[]>
    tableOnRename: (name: string, replacement: string) => Promise<void>
    tableOnDelete: (table: string) => Promise<any>
    onSubmit: (value: Record<string, any>) => Promise<any>
}

const ListRender = (props: ListRenderProps) => {
    const intl = useIntl()
    const [renameModalVisible, setRenameModalVisible] = useState<boolean>(false)

    const onRenameTable = (name: string) => (replacement: string) =>
        props.tableOnRename(name, replacement).finally(() => setRenameModalVisible(false))

    const onDeleteClick = (name: string) => () =>
        Modal.confirm({
            title: intl.formatMessage({ id: "gallery.component.dataset-controller-sider2" }),
            icon: <ExclamationCircleOutlined />,
            okType: "danger",
            onOk: () => props.tableOnDelete(name),
        })

    const menu = (
        <Menu>
            <Menu.Item
                key={"checkAll"}>
                <Button
                    type="link"
                    size="small"
                    icon={<ReadOutlined />}
                    onClick={() => props.tableOnClick(props.item)}
                >
                    <FormattedMessage id="gallery.component.dataset-controller-sider3" />
                </Button>
            </Menu.Item>
            <Menu.Item
                key={"query"}>
                <QuerySelectorModal
                    trigger={
                        <Button
                            type="link"
                            size="small"
                            icon={<SearchOutlined />}
                        >
                            <FormattedMessage id="gallery.component.general34" />
                        </Button>
                    }
                    storagesOnFetch={props.storagesOnFetch}
                    storageOnSelect={props.storageOnSelect}
                    tableOnSelect={() => props.tableOnSelect(props.item)}
                    onSubmit={props.onSubmit}
                    initialValues={{ id: props.id, tableName: props.item }}
                />
            </Menu.Item>
            <Menu.Item
                key={"rename"}>
                <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setRenameModalVisible(true)}
                >
                    <FormattedMessage id="gallery.component.general35" />
                </Button>
                <RenameTableModal
                    intl={intl}
                    visible={renameModalVisible}
                    originalName={props.item}
                    onOk={onRenameTable(props.item)}
                    onCancel={() => setRenameModalVisible(false)}
                />
            </Menu.Item>
            <Menu.Item
                key={"delete"}>
                <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onDeleteClick(props.item)}
                >
                    <FormattedMessage id="gallery.component.general23" />
                </Button>
            </Menu.Item>
        </Menu>
    )

    return (
        <List.Item
            key={props.item}
        >
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {props.item}
                </a>
            </Dropdown>
        </List.Item>
    )
}


export interface SiderProps {
    id?: string
    tableList: string[]
    storagesOnFetch: () => Promise<DataType.StorageSimple[]>
    storageOnSelect: (id: string) => Promise<string[]>
    tableOnClick: (name: string) => Promise<any>
    tableOnSelect: (name: string) => Promise<string[]>
    tableOnRename: (name: string, replacement: string) => Promise<void>
    tableOnDelete: (table: string) => Promise<any>
    onSubmit: (value: Record<string, any>) => Promise<any>
    style?: React.CSSProperties
}

// todo: search table name
export const Sider = (props: SiderProps) => {

    const renderItem = (item: string) =>
        <ListRender
            id={props.id}
            item={item}
            storagesOnFetch={props.storagesOnFetch}
            storageOnSelect={props.storageOnSelect}
            tableOnClick={props.tableOnClick}
            tableOnSelect={props.tableOnSelect}
            tableOnRename={props.tableOnRename}
            tableOnDelete={props.tableOnDelete}
            onSubmit={props.onSubmit}
        />

    return (
        <Space direction="vertical" style={{ ...props.style }}>
            <span style={{ fontWeight: "bold" }}>
                <FormattedMessage id="gallery.component.dataset-controller-sider4" />
            </span>
            {
                props.tableList.length !== 0 ?
                    <List
                        size="small"
                        pagination={{
                            size: "small",
                            defaultPageSize: 20,
                            showSizeChanger: true
                        }}
                        dataSource={props.tableList}
                        renderItem={renderItem}
                    /> : <></>
            }
        </Space>
    )
}

