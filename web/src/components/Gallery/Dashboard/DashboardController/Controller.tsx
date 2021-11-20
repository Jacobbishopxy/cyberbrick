/**
 * Created by Jacob Xie on 9/24/2020.
 */

import { useEffect, useMemo, useState, useContext } from "react"
import { Button, message, Modal, Space } from "antd"
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    PlusCircleOutlined,
    PoweroffOutlined,
    SettingOutlined
} from "@ant-design/icons"
import { FormattedMessage, useIntl } from "umi"

import { SpaceBetween } from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"
import { SelectorPanel } from "./SelectorPanel"
import { AddModuleModal } from "./AddModuleModal"

export interface ModuleControllerProps {
    initialSelected?: string[]
    onSelectChange?: (v: string[]) => void
    canEdit: boolean
    categoriesAllType: DataType.Category[]
    dashboardCategories: DataType.Category[]
    categoryOnSelect: (categoryName: string, isCopy: boolean) => Promise<DataType.Category>
    dashboardOnSelect: (id: string, isCopy: boolean) => Promise<DataType.Dashboard>
    onAddModule: (name: string, timeSeries: boolean, value: DataType.ElementType) => void
    onCopyTemplate: (originTemplateId: string) => void
    edit: boolean
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
    onSaveTemplate: (shouldSaveTemplateAndContents: boolean) => Promise<void>
}

export const Controller = (props: ModuleControllerProps) => {
    const intl = useIntl()
    // const [edit, setEdit] = useState<boolean>(props.edit)
    const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)

    // useEffect(() => {
    //     console.log(42, edit)
    //     props.onEditTemplate(() => edit)
    // }, [edit])



    useEffect(() => {
        if (props.initialSelected && props.initialSelected[1])
            props.dashboardOnSelect(props.initialSelected[1], false).finally()
    }, [props.initialSelected])

    const quitAddModule = () => setAddModuleModalVisible(false)

    //模板保存事件。
    const saveTemplate = (exist: boolean) =>
        () => {
            //exit: set edit to false; save: set edit to true and allow further edition.
            // Exit:设置edit为false; 保存:设置edit为true并允许进一步编辑。  
            const quit = () => exist ? props.setEdit(false) : undefined
            return Modal.confirm({
                title: intl.formatMessage({ id: "gallery.component.dashboard-controller1" }),
                icon: <ExclamationCircleOutlined />,
                onOk: () => props.onSaveTemplate(true)
                    .then(() => {
                        message.success(intl.formatMessage({ id: "gallery.component.dashboard-controller2" }))
                        quit()
                    })
                    .catch(err => {
                        message.error(`Error: ${err}`)
                        quit()
                    })
                ,
                onCancel: () => {
                    exist && props.onSaveTemplate(false).then(quit)
                },
            })
        }

    const editMode = useMemo(() => (
        <>
            <Space>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => setAddModuleModalVisible(true)}
                >
                    <PlusCircleOutlined />
                    <FormattedMessage id="gallery.component.general10" />
                </Button>
                <Button
                    type="primary"
                    size="small"
                    onClick={saveTemplate(false)}
                >
                    <CheckCircleOutlined />
                    <FormattedMessage id="gallery.component.general11" />
                </Button>
                <Button
                    size="small"
                    danger
                    onClick={saveTemplate(true)}
                >
                    <PoweroffOutlined />
                    <FormattedMessage id="gallery.component.general12" />
                </Button>

            </Space>
            <AddModuleModal
                onAddModule={props.onAddModule}
                categories={props.categoriesAllType}
                categoryOnSelect={name => props.categoryOnSelect(name, true)}
                dashboardOnSelect={id => props.dashboardOnSelect(id, true)}
                copyTemplate={props.onCopyTemplate}
                visible={addModuleModalVisible}
                onQuit={quitAddModule}
            />
        </>
    ), [addModuleModalVisible, props.onSaveTemplate])

    //使能状态
    const idleMode = useMemo(() => (
        <Button
            type="primary"
            size="small"
            onClick={() => props.setEdit(true)}
            disabled={!props.canEdit}
        >
            <SettingOutlined />
            <FormattedMessage id="gallery.component.general14" />
        </Button>
    ), [props.canEdit])

    return (
        <SpaceBetween>
            <SelectorPanel
                initValue={props.initialSelected}
                isMainController={true}
                categories={props.dashboardCategories}
                categoryOnSelect={name => props.categoryOnSelect(name, false)}
                onSelectFinish={id => props.dashboardOnSelect(id, false)}
                onChange={props.onSelectChange}
                size="small"
            />
            <div style={{
                position: 'fixed',
                right: '50px',
                top: '70px',
                zIndex: 10
            }}>
                {props.edit ? editMode : idleMode}
            </div>
        </SpaceBetween>
    )
}

Controller.defaultProps = {
    markAvailable: false
} as Partial<ModuleControllerProps>

