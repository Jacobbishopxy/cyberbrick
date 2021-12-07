/**
 * Created by Jacob Xie on 11/20/2020
 */

import { useState, useEffect } from "react"
import { Button, Select, Space } from "antd"
import { DownloadOutlined, ExclamationCircleOutlined, MinusCircleOutlined, UploadOutlined } from "@ant-design/icons"
import { FormattedMessage } from "umi"

import { Editor } from "@/components/Editor"
import { SpaceBetween } from "@/components/SpaceBetween"
import { FileInsertModal } from "@/components/FileUploadModal"
import * as DataType from "../../GalleryDataType"
import { QueryViewer, QueryField } from "./QueryField"
import { useLocation } from 'react-router-dom'
import { LocalStorageHelper } from "@/utils/localStorageHelper"

const IdViewer = (props: { visible: boolean, onClick: (value: boolean) => void }) =>
    props.visible ?
        <Editor
            icons={{ open: <ExclamationCircleOutlined />, close: <MinusCircleOutlined /> }}
            onChange={props.onClick}
        /> : <></>


export interface HeaderProps {
    storages: DataType.StorageSimple[]
    storageOnSelect: (id: string) => void
    onExecute: (sql: string) => void
    uploadAddress?: String
    onUpload: (option: any, data: any) => Promise<any>
    onUploadFinished: () => void
}

export const Header = (props: HeaderProps) => {
    const [selectedDb, setSelectedDb] = useState<string>()
    const [idVisible, setIdVisible] = useState<boolean>(false)
    const [queryVisible, setQueryVisible] = useState<boolean>(false)
    const [uploadVisible, setUploadVisible] = useState<boolean>(false)

    const ls = new LocalStorageHelper("gallery.dataset", { expiry: [1, "week"] })
    const lsKey = 'DBSelect'
    const query = new URLSearchParams(useLocation().search)

    const [initValue, setInitValue] = useState<string>()

    const onDatabaseSelect = (id: string) => {

        setInitValue(id)
    }


    useEffect(() => {
        const initialValue = query.get("anchor")
        console.log(30, initialValue)
        if (initialValue) {
            try {
                const pi = JSON.parse(initialValue)
                setInitValue(pi)
            } catch { }
        } else {
            const i = ls.get(lsKey)
            if (i) setInitValue(JSON.parse(i.data))
        }
    }, [])

    useEffect(() => {
        console.log(48, initValue)
        ls.add(lsKey, JSON.stringify(initValue))
        props.storageOnSelect(initValue)
        setSelectedDb(initValue)
    }, [initValue])

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <SpaceBetween>
                <Space>
                    <span style={{ fontWeight: "bold" }}>
                        <FormattedMessage id="gallery.component.general19" />
                    </span>
                    {/* 数据库select */}
                    <Select
                        style={{ width: 200 }}
                        onSelect={(id) => setInitValue(id)}
                        onChange={() => console.log(84)}
                        size="small"
                        placeholder="Database"
                        value={initValue}
                    >
                        {
                            props.storages.map(s => {
                                console.log(64, s)
                                return (<Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)
                            }

                            )
                        }
                    </Select>
                    <div>
                        <IdViewer visible={!!selectedDb} onClick={setIdVisible} />
                        {idVisible ? <span>ID: {selectedDb}</span> : <></>}
                    </div>
                </Space>

                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<UploadOutlined />}
                        disabled={!selectedDb}
                        onClick={() => setUploadVisible(true)}
                    >
                        <FormattedMessage id="gallery.component.general26" />
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<DownloadOutlined />}
                        disabled
                    >
                        <FormattedMessage id="gallery.component.general27" />
                    </Button>
                    <QueryViewer onClick={setQueryVisible} />
                </Space>
            </SpaceBetween>

            <QueryField
                queryVisible={queryVisible}
                onExecute={props.onExecute}
            />

            <FileInsertModal
                idList={props.storages}
                setVisible={setUploadVisible}
                visible={uploadVisible}
                uploadAddress={props.uploadAddress}
                upload={props.onUpload}
                uploadResHandle={props.onUploadFinished}
            />
        </Space>
    )
}

