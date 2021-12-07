/**
 * Created by Jacob Xie on 11/19/2020
 */

import React, { useState } from 'react'
import {
    Button,
    Checkbox,
    Divider,
    Form,
    message,
    Modal,
    Upload,
    Input,
} from "antd"
import { UploadOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from "umi"


const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}


export interface BaseModalProps {
    children: React.ReactElement[]
    initialValues?: Record<any, any>
    setVisible: (value: boolean) => void
    visible: boolean
    beforeUpload?: (file: File) => boolean
    uploadAddress?: any
    upload: (option: Record<string, any>, data: any) => Promise<any>
    uploadResHandle?: (value: any) => void
}

export const BaseModal = (props: BaseModalProps) => {
    const intl = useIntl()
    const [form] = Form.useForm()

    const [uploading, setUploading] = useState<boolean>(false)
    const [uploadFiles, setUploadFiles] = useState<File[]>([])

    const uploadProps = {
        multiple: false,
        // action: props.uploadAddress,
        beforeUpload: (file: File) => {
            if (props.beforeUpload) {
                if (props.beforeUpload(file)) {
                    setUploadFiles([file])
                    return true
                } else {
                    message.error(`file type: ${file.type} is not allowed!`)
                    return false
                }
            }
            setUploadFiles([file])
            return false
        },
        onRemove: () => setUploadFiles([]),
    }

    const clearData = () => {
        setUploading(false)
        setUploadFiles([])
    }

    const onUploadFile = (options: Record<string, any>) => {
        if (uploadFiles.length !== 0) {
            const data = new FormData()
            data.append("file", uploadFiles[0])
            setUploading(true)

            props.upload(options, data)
                .then(res => {
                    message.success(res.statusText)
                    clearData()
                    if (props.uploadResHandle) props.uploadResHandle(res.data)
                })
                .catch(err => {
                    clearData()
                    message.error(JSON.stringify(err, null, 2))
                })
        }
    }

    const onReset = () => {
        clearData()
        form.resetFields()
    }

    const onFinish = () => {
        form.validateFields()
            .then(values => {
                onUploadFile(values)
                onReset()
                props.setVisible(false)
            })
    }


    return (
        <Modal
            title={intl.formatMessage({ id: "component.fileUploadModal.baseModal.title" })}
            visible={props.visible}
            onOk={onFinish}
            onCancel={() => props.setVisible(false)}
            confirmLoading={uploading}
            width="40vw"
        >
            <Form
                {...formItemLayout}
                form={form}
                initialValues={props.initialValues}
            >

                <Divider plain orientation="left" style={{ color: "lightgray" }}>
                    <FormattedMessage id="component.fileUploadModal.baseModal.file" />
                </Divider>

                {/* 文件上传 */}
                <Form.Item
                    name="file"
                    label={<FormattedMessage id="component.fileUploadModal.baseModal.file" />}
                    rules={[{ required: true, message: "File is required" }]}
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>
                            <FormattedMessage id="component.fileUploadModal.baseModal.upload" />
                        </Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="transpose"
                    label={<FormattedMessage id="component.fileUploadModal.baseModal.transpose" />}
                    valuePropName="checked"
                >
                    <Checkbox>
                        <FormattedMessage id="component.fileUploadModal.baseModal.transposeText" />
                    </Checkbox>
                </Form.Item>

                <Form.Item
                    name="sheetPrefix"
                    label={<FormattedMessage id="component.fileUploadModal.baseModal.sheetPrefix" />}
                >
                    <Input />
                </Form.Item>

                {props.children}

            </Form>
        </Modal>
    )
}

BaseModal.defaultProps = {
    initialValues: {}
} as Partial<BaseModalProps>

