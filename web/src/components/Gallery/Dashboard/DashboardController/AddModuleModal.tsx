/**
 * Created by Jacob Xie on 9/24/2020.
 */

import { useEffect, useState } from "react"
import { Checkbox, Divider, Input, List, message, Modal, Radio, Space, Tabs, Tooltip } from "antd"
import { ExclamationCircleTwoTone, RightOutlined, StarTwoTone } from "@ant-design/icons"
import { FormattedMessage } from "umi"

import * as DataType from "../../GalleryDataType"
import { moduleList } from "../../ModulePanel/Collections"
import { SelectorPanel } from "./SelectorPanel"

import styles from "./Common.less"


interface ModuleSelectionListProps {
    onSelect: (value: string) => void
}

const ModuleSelectionList = (props: ModuleSelectionListProps) =>
    <>
        {moduleList.map(chunk => (
            <div key={chunk.key}>
                <Divider orientation="left">{chunk.name}</Divider>
                <List
                    grid={{ column: 6 }}
                    size="small"
                    dataSource={chunk.children}
                    renderItem={item => (
                        <List.Item>
                            <label className={styles.moduleSelectionLabel}>
                                <input type="radio" name="radio-name" disabled={item.disabled} id={item.key} />
                                <div
                                    id={item.key}
                                    onClick={() => props.onSelect(item.key)}
                                    className={item.disabled ? styles.selectionCardDisabled : styles.selectionCard}
                                >
                                    {item.name}
                                </div>
                            </label>
                        </List.Item>
                    )}
                />
            </div>
        ))}
    </>

interface ModuleSelectionViewProps {
    setName: (value: string) => void
    setTimeSeries: (value: boolean) => void
    setSelected: (value: string) => void
}

const ModuleSelectionView = (props: ModuleSelectionViewProps) =>
    <>
        <Space direction="vertical">
            <Space>
                <StarTwoTone />
                <span style={{ width: 250, fontSize: 15 }}>
                    <FormattedMessage id="gallery.component.add-module-modal4" />
                </span>
            </Space>
            <Space>
                <RightOutlined />
                <Input style={{ width: 200 }} onChange={e => props.setName(e.target.value)} />
                <Tooltip
                    title={<FormattedMessage id="gallery.component.add-module-modal3" />}
                >
                    <ExclamationCircleTwoTone twoToneColor="red" />
                </Tooltip>
            </Space>
            <Space>
                <StarTwoTone />
                <span style={{ width: 250, fontSize: 15 }}>
                    <FormattedMessage id="gallery.component.add-module-modal5" />
                </span>
            </Space>
            <Space>
                <RightOutlined />
                <Checkbox onChange={e => props.setTimeSeries(e.target.checked)}>
                    <FormattedMessage id="gallery.component.add-module-modal6" />
                </Checkbox>
            </Space>
        </Space>
        <ModuleSelectionList onSelect={props.setSelected} />
    </>


interface TemplateSelectionViewProps {
    categories: DataType.Category[]
    categoryOnSelect: (categoryName: string) => Promise<DataType.Category>
    dashboardOnSelect: (id: string) => Promise<DataType.Dashboard>
    onSelectedTemplate: (templateId: string) => void
}

const TemplateSelectionView = (props: TemplateSelectionViewProps) => {
    const [ctType, setCtType] = useState(DataType.CategoryTypeEnum.temp_lib)
    const [categories, setCategories] = useState<DataType.Category[]>([])

    const typeOnChange = (e: any) => {
        // console.log(e.target.value, props.categories, categories)
        setCtType(e.target.value)
    }

    useEffect(() => {
        setCategories(props.categories.filter(ct => ct.type === ctType))
    }, [ctType])
    // const categories = props.categories.filter(ct => ct.type === ctType)

    return <Space direction="vertical" style={{ marginBottom: 20 }}>
        <Space>
            <StarTwoTone />
            <span style={{ fontSize: 15 }}>
                <FormattedMessage id="gallery.component.add-module-modal7" />
            </span>
        </Space>
        <Space>
            <RightOutlined />
            <Radio.Group onChange={typeOnChange}>
                <Space>
                    {DataType.categoryTypeSelector.map(type =>
                        <Radio key={type} value={type}> <FormattedMessage id={`gallery.component.category-config-table_type-${type}`} /></Radio>)}
                </Space>
            </Radio.Group>
            <SelectorPanel
                categories={categories}
                categoryOnSelect={props.categoryOnSelect}
                dashboardOnSelect={props.dashboardOnSelect}
                onSelectFinish={props.onSelectedTemplate}
                size="small"
            />
            <Tooltip
                title={<FormattedMessage id="gallery.component.add-module-modal2" />}
            >
                <ExclamationCircleTwoTone twoToneColor="red" />
            </Tooltip>
        </Space>
    </Space>
}

export interface AddModuleModalProps {
    onAddModule: (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => void
    categories: DataType.Category[]
    categoryOnSelect: (categoryName: string) => Promise<DataType.Category>
    dashboardOnSelect: (id: string) => Promise<DataType.Dashboard>
    copyTemplate: (originTemplateId: string) => void
    visible: boolean
    onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

    const [selected, setSelected] = useState<string>()
    const [moduleName, setModuleName] = useState<string>()
    const [timeSeries, setTimeSeries] = useState<boolean>(false)
    const [selectedPane, setSelectedPane] = useState<string>("Module")
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>()

    const onSetOk = () => {
        if (selectedPane === "Module") {
            if (selected && moduleName) {
                props.onQuit()
                props.onAddModule(moduleName, timeSeries, DataType.getElementType(selected))
            } else
                message.warn("Please enter your element name and select one module!")
        }
        if (selectedPane === "Template") {
            if (selectedTemplateId) {
                props.onQuit()
                props.copyTemplate(selectedTemplateId)
            }
        }
    }

    return (
        <Modal
            title={<FormattedMessage id="gallery.component.add-module-modal1" />}
            visible={props.visible}
            onOk={onSetOk}
            onCancel={props.onQuit}
            width="60%"
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            style={{ top: 40 }}
        >
            <Tabs
                defaultActiveKey={selectedPane}
                onChange={setSelectedPane}
            >
                {/* 模块 */}
                <Tabs.TabPane
                    tab={<FormattedMessage id="gallery.component.general9" />}
                    key="Module"
                >
                    <ModuleSelectionView
                        setName={setModuleName}
                        setTimeSeries={setTimeSeries}
                        setSelected={setSelected}
                    />
                </Tabs.TabPane>
                {/* 界面 */}
                <Tabs.TabPane
                    tab={<FormattedMessage id="gallery.component.general7" />}
                    key="Template"

                >
                    <TemplateSelectionView
                        categories={props.categories}
                        categoryOnSelect={props.categoryOnSelect}
                        dashboardOnSelect={props.dashboardOnSelect}
                        onSelectedTemplate={setSelectedTemplateId}
                    />
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    )
}

