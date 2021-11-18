/**
 * Created by Jacob Xie on 12/30/2020
 */

import { useState } from "react"
import { Button, message, Modal } from "antd"
import { ProFormCheckbox, ProFormRadio, StepsForm } from "@ant-design/pro-form"
import { FormattedMessage, useIntl } from "umi"
import _ from "lodash"

import * as DataType from "../../../GalleryDataType"
import { DataSelectedType, GeneralTableConfigInterface } from "@/components/Gallery/Utils/data"
import { ModuleEditorField } from "../../Generator/data"
import { DataSourceSelectorForm } from "./DataSourceSelectorForm"
import { ColumnIdentifier } from "@/components/Gallery/Dataset/ColumnIdentifier/ColumnIdentifierItems"


const viewStyleOptions = [
    {
        label: <FormattedMessage id="gallery.component.module-panel.table.general-table-editor-field1" />,
        value: "default"
    },
    {
        label: <FormattedMessage id="gallery.component.module-panel.table.general-table-editor-field2" />,
        value: "xlsx"
    }
]

const viewOptionOptions = [
    {
        label: <FormattedMessage id="gallery.component.module-panel.table.general-table-editor-field3" />,
        value: "header"
    },
    {
        label: <FormattedMessage id="gallery.component.module-panel.table.general-table-editor-field4" />,
        value: "border"
    }
]

export const GeneralTableEditorField = (props: ModuleEditorField) => {
    const intl = useIntl()
    const [visible, setVisible] = useState(false)
    const [dataType, setDataType] = useState<DataSelectedType>()
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [dataColumns, setDataColumns] = useState<string[]>([])

    const saveContent = async (config: Record<string, any>) => {
        if (content) {
            const c = config as GeneralTableConfigInterface
            let storageType
            switch (dataType) {
                case DataType.flexTableType.file:
                    storageType = DataType.StorageType.MONGO
                    break;
                case DataType.flexTableType.dataset:
                    storageType = DataType.StorageType.PG
                default:
                    break;
            }
            const ctt = {
                ...content,
                date: content.date || DataType.today(),
                config: { ...c, type: dataType, view: c.view || [] },
                storageType: storageType
            }
            if (props.setContent) {

                props.setContent(ctt)
            }
            message.success("Updating succeeded!")
        } else
            message.warn("Updating failed!")
        setVisible(false)
    }

    const dataSelectOnFinish = async () => {
        if (content?.data === undefined || content?.data.length === 0) {
            message.warn("Please choose your data!")
            return false
        }
        //Important: if dataType has type other than "file" or "dataset"
        //make sure to update enum "flexTableType" in web/server/gallery/common.ts
        if (dataType === DataType.flexTableType.file) {
            setDataColumns(_.values(content!.data?.source[0][0]))
            console.log("finish data select, returning from...", _.values(content!.data?.source[0][0]))
            return true
        }
        if (dataType === DataType.flexTableType.dataset) {
            setDataColumns(content!.data.source.selects)
            return true
        }
        message.warn("Please check data format!")
        return false
    }

    return (
        <div className={props.styling}>
            <Button
                type="primary"
                onClick={() => setVisible(true)}
            >
                <FormattedMessage id="gallery.component.general42" />
            </Button>

            <StepsForm
                onFinish={saveContent}
                stepsFormRender={(dom, submitter) =>
                    <Modal
                        title={intl.formatMessage({ id: "gallery.component.module-panel.graph.utils.common1" })}
                        visible={visible}
                        onCancel={() => setVisible(false)}
                        footer={submitter}
                        destroyOnClose
                        width="30vw"
                    >
                        {dom}
                    </Modal>
                }
            >
                <StepsForm.StepForm
                    name="data"
                    title={intl.formatMessage({ id: "gallery.component.general43" })}
                    onFinish={dataSelectOnFinish}
                >
                    <DataSourceSelectorForm
                        content={content}
                        saveContent={setContent}
                        fetchStorages={props.fetchStorages!}
                        fetchTableList={props.fetchTableList!}
                        fetchTableColumns={props.fetchTableColumns!}
                        dataType={dataType}
                        dataSelected={setDataType}
                    />
                </StepsForm.StepForm>

                <StepsForm.StepForm
                    name="option"
                    title={intl.formatMessage({ id: "gallery.component.general56" })}
                    initialValues={{ "style": "default" }}
                >
                    <ProFormRadio.Group
                        name="style"
                        label={<FormattedMessage id="gallery.component.module-panel.table.general-table-editor-field5" />}
                        options={viewStyleOptions}
                    />
                    <ProFormCheckbox.Group
                        name="view"
                        label={<FormattedMessage id="gallery.component.module-panel.table.general-table-editor-field6" />}
                        options={viewOptionOptions}
                    />
                </StepsForm.StepForm>

                <StepsForm.StepForm
                    name="display"
                    title={intl.formatMessage({ id: "gallery.component.general44" })}
                >
                    <ColumnIdentifier columns={dataColumns} />
                </StepsForm.StepForm>
            </StepsForm>
        </div>
    )
}

