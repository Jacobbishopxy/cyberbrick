import { useState, useContext, useEffect } from "react"
import { Button, Checkbox, Divider, Input, List, message, Modal, Space, Tooltip } from "antd"
import { ExclamationCircleTwoTone, RightOutlined, StarTwoTone, EditOutlined } from "@ant-design/icons"

import { FormattedMessage, useIntl } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import { moduleList } from "@/components/Gallery/ModulePanel/Collections"

import { TabItemSelection } from "../Header/TabItemSelection"
import styles from "@/components/Gallery/Dashboard/DashboardController/Common.less"
// import { ModalForm } from "@ant-design/pro-form";

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
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
    setElementType: (value: string) => void
    setHeadData: React.Dispatch<React.SetStateAction<DataType.ElementHeadData | undefined>>
}

import { getChoiceElement } from "@/components/Gallery/ModulePanel/Collections/NestedModule/Header/TabChoice"
import { tabContentChoice } from "@/components/Gallery/ModulePanel/Collections/NestedModule/data"

const ModuleSelectionView = (props: ModuleSelectionViewProps) => {

    // const onFinish = async () => {
    //     props.setSelected(selected)
    //     // console.log(selected)
    //     selectedType === 'icon' ? props.endEdit(selectedType) : props.endEdit(selectedType, input)
    //     return true;
    // }

    //icon的类型
    const [tabType, setTabType] = useState('')
    //icon的内容
    const [selected, setSelected] = useState('');

    const onFinish = (iconType: string, iconContent: string) => {
        //not icon
        props.setHeadData((headData) => {
            return {
                iconContent,
                iconType,
            } as DataType.ElementHeadData
        })

        //update tab iconType
        setTabType(iconType)
        setSelected(iconContent)

        // console.log(tabType, input, selected)
    }

    useEffect(() => {
        console.log(100, tabType, selected)
    }, [tabType, selected])

    const displayHeader = () => {
        //get content from tabContent
        let headerContent: any = getChoiceElement(selected || "")

        // const className = ([typtypee] === "text") ? "tab-text" : "display-content"
        //calculate fontSize based on the minimal of tab's dimension (width/height)
        const fontSize = (tabType === "text") ? "12px" : "40px"
        // if (props.editable && selected) {
        //     //get content from newly created information
        //     headerContent = getChoiceElement(selected as tabContentChoice)
        // }
        // console.log(el.i, selected)
        return (
            <span
                style={{ fontSize: fontSize }}
            >
                {headerContent}
            </span>)
    }
    return (
        <div>
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
                    {/* <Tooltip
                        title={<FormattedMessage id="gallery.component.add-module-modal3" />}
                    >
                        <ExclamationCircleTwoTone twoToneColor="red" />
                    </Tooltip> */}


                    {/* iconModal */}
                    <TabItemSelection
                        // selected={selected}
                        // setSelected={setSelected}
                        // endEdit={endEdit}
                        onFinish={onFinish}

                        trigger={<Button
                            type="primary"
                            style={{
                                marginLeft: '80px'
                            }}>
                            <FormattedMessage id="gallery.component.module-panel.nested-simple-module2" />
                        </Button>}
                    />

                    {/* 显示icon */}
                    {displayHeader()}
                </Space>
                <Space style={{
                    color: 'red'
                }}>
                    <ExclamationCircleTwoTone twoToneColor="red" />
                    <FormattedMessage id="gallery.component.add-module-modal3" />
                </Space>


                <Space style={{
                    marginTop: '20px'
                }}>
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
            <ModuleSelectionList onSelect={props.setElementType} />
        </div>
    )
}


export interface NestedAddModuleModalProps {
    onAddSubModule: (name: string, timeSeries: boolean, moduleType: DataType.ElementType, headData: DataType.ElementHeadData | undefined) => void
    // categories: DataType.Category[]
    // categoryOnSelect: (categoryName: string) => Promise<DataType.Category>
    // dashboardOnSelect: (id: string) => Promise<DataType.Dashboard>
    // copyTemplate: (originTemplateId: string) => void
    visible: boolean
    onQuit: () => void
    // addElement: ((name: string, timeSeries: boolean, elementType: DataType.ElementType, isNested?: boolean) => boolean) | undefined
    setDraggable: React.Dispatch<React.SetStateAction<boolean>>
}

// import { DashboardContext } from "@/components/Gallery/Dashboard/DashboardContext"
export const NestedAddModuleModal = (props: NestedAddModuleModalProps) => {

    // 
    const [elementType, setElementType] = useState<string>()
    const [moduleName, setModuleName] = useState<string>()
    const [timeSeries, setTimeSeries] = useState<boolean>(false)
    const [headData, setHeadData] = useState<DataType.ElementHeadData>()
    console.log(103103)
    // const dashboardContextProps = useContext(DashboardContext)

    const NestedDedicatedProps = useContext(nestedDedicatedContext)
    const intl = useIntl()
    const onSetOk = () => {

        if (elementType && moduleName) {
            // 是否重命名
            if (NestedDedicatedProps?.elements?.filter((v) => v.parentName === NestedDedicatedProps.elementName && v.isSubmodule).map(e => e.name).includes(moduleName)) {
                message.warning(intl.formatMessage({ id: "gallery.component.add-module-modal8" }))
            } else {
                // 添加tab和elements
                props.onAddSubModule(moduleName, timeSeries, DataType.getElementType(elementType), headData)
                // }

                //关闭modal
                props.onQuit()
                //使能RGL组件
                props.setDraggable(() => true)
                console.log(102, moduleName, timeSeries, DataType.getElementType(elementType))
            }


        } else
            message.error("Please enter your element name and select one module!")
    }

    return (
        <Modal
            title={<FormattedMessage id="gallery.component.add-module-modal1" />}
            visible={props.visible}
            onOk={onSetOk}
            onCancel={
                () => {
                    //使能container组件
                    props.onQuit()
                    props.setDraggable(() => true)
                }
            }
            width="60%"
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            style={{ top: 40 }}
        >
            <ModuleSelectionView
                setName={setModuleName}
                setTimeSeries={setTimeSeries}
                setElementType={setElementType}
                setHeadData={setHeadData}
            />
        </Modal>
    )
}
