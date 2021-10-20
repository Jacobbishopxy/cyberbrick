/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { useState } from "react"
import { Button, message, Modal, Tabs } from "antd"
import { HotTable } from "@handsontable/react"
import { ProFormCheckbox, StepsForm } from "@ant-design/pro-form"
import { FormattedMessage, useIntl } from "umi"
import _ from "lodash"

import { FileExtractModal } from "@/components/FileUploadModal"
import { XlsxTableConfigInterface } from "@/components/Gallery/Utils/data"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import { fileExtract, fileExtractUrl } from "../../../Misc/FileUploadConfig"

import "handsontable/dist/handsontable.full.css"


const viewOptionOptions = [
    {
        label: <FormattedMessage id="gallery.component.module-panel.table.xlsx-table1" />,
        value: "col"
    },
    {
        label: <FormattedMessage id="gallery.component.module-panel.table.xlsx-table2" />,
        value: "row"
    }
]
const licenseKey = "non-commercial-and-evaluation"

// todo: editing in two ways: 1. upload file, 2. edit cell
const EditorField = (props: ModuleEditorField) => {
    const intl = useIntl()
    const [visible, setVisible] = useState<boolean>(false)
    const [uploadVisible, setUploadVisible] = useState<boolean>(false)
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)

    const saveContentData = (data: any) => {
        const ctt = content ? {
            ...content,
            data: { ...content.data, source: data },
        } : {
            date: DataType.today(),
            data: { source: data },
        }
        setContent(ctt)
    }

    const saveContent = async (config: Record<string, any>) => {
        if (content) {
            const c = config as XlsxTableConfigInterface
            const ctt = {
                ...content,
                date: content.date || DataType.today(),
                config: { ...c, hideOptions: c.hideOptions || [] }
            }
            props.updateContent(ctt)
            message.success("Updating succeeded!")
        } else {
            message.warn("Updating failed! File and options are required!")
        }
        setVisible(false)
    }

    const dataSelectOnFinish = async () => {
        if (!content?.data?.source || _.isEmpty(content.data.source)) {
            message.warn("Please check your data if is empty!")
            return false
        }
        return true
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
                        title="Setup process"
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
                    <Button
                        type="primary"
                        onClick={() => setUploadVisible(true)}
                    >
                        <FormattedMessage id="gallery.component.general26" />
                    </Button>
                    <FileExtractModal
                        setVisible={setUploadVisible}
                        visible={uploadVisible}
                        uploadAddress={fileExtractUrl}
                        upload={fileExtract}
                        uploadResHandle={saveContentData}
                    />
                </StepsForm.StepForm>

                <StepsForm.StepForm
                    name="option"
                    title={intl.formatMessage({ id: "gallery.component.general56" })}
                >
                    <ProFormCheckbox.Group
                        name="hideOptions"
                        label={<FormattedMessage id="gallery.component.module-panel.table.xlsx-table3" />}
                        options={viewOptionOptions}
                    />
                </StepsForm.StepForm>
            </StepsForm>
        </div>
    )
}

export const genHotTableProps = (height: number | undefined, hideOptions?: string[]) => {
    const colHeaders = !hideOptions?.includes("col")
    const rowHeaders = !hideOptions?.includes("row")
    return {
        readOnly: true,
        settings: {
            width: "100%",
            // height: height ? height - 50 : undefined
            height: '99%'
        },
        colHeaders,
        rowHeaders,
        licenseKey,
    }
}

const PresenterField = (props: ModulePresenterField) => {
    console.log(151, props.styling)
    const singleS = (data: Record<string, any[]>) => (
        <HotTable
            {...genHotTableProps(props.contentHeight, props.content?.config?.hideOptions)}
            data={data["0"]}
        />
    )

    const multiS = (data: Record<string, any[]>) => {
        const d: any[] = []
        _.mapValues(data, (v: any[], k: string) => {
            d.push(
                <Tabs.TabPane tab={k} key={k}>
                    <HotTable key={k}
                        {...genHotTableProps(props.contentHeight, props.content?.config?.hideOptions)}
                        data={v}
                    />
                </Tabs.TabPane>
            )
        })

        return <Tabs tabPosition="bottom">{d}</Tabs>
    }

    const view = (content: DataType.Content) => {
        const d = _.keys(content?.data?.source)
        // console.log(content?.data, d?.length)
        if (d && d.length != 0) {
            if (d.length === 1)
                return singleS(content.data?.source)
            return multiS(content.data?.source)
        }
        //TODO: this is to accomodate older content type. When all
        //content.data has been saved to mongo, disregard this.
        if (content?.data) {
            const dNoSource = _.keys(content.data)
            // console.log(dNoSource?.length)
            if (dNoSource) {
                if (dNoSource.length === 1)
                    return singleS(content.data)
                return multiS(content.data)
            }
        }
        return <></>
    }

    return props.content && props.content.data ?
        // <div className={props.styling}>{view(props.content)}</div> : <></>
        <div style={{
            height: '95%'
        }}>{view(props.content)}</div> : <></>
}

export const XlsxTable = new ModuleGenerator(EditorField, PresenterField).generate()

