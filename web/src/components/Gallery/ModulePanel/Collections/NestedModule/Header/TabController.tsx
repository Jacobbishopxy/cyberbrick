import { ElementType } from "@/components/Gallery/GalleryDataType"
import { tabContentChoice, tabItem } from "@/components/Gallery/ModulePanel/Collections/NestedModule/data"
import { AddModuleModal } from "@/components/Gallery/ModulePanel/Collections/NestedModule/EmbededModule/AddModuleModal"
import { getChoiceElement } from "@/components/Gallery/ModulePanel/Collections/NestedModule/Header/TabChoice"
import { FileAddOutlined, DeleteOutlined } from "@ant-design/icons"
import { Tooltip, Button } from "antd"
import { CSSProperties, useEffect, useState, useContext } from "react"
import { useIntl } from "umi"
import { TabItemSelection } from "./TabItemSelection"
import * as DataType from '@/components/Gallery/GalleryDataType'
import { DashboardContext } from "@/components/Gallery/Dashboard/DashboardContext"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
interface TabControllerProps {
    onAddSubModule: (name: string, timeSeries: boolean, moduleType: ElementType) => void;
    editable: boolean,
    style?: CSSProperties | undefined,
    className?: string | undefined,
    isHover: boolean,
    // isSelected: boolean,
    el: DataType.Element,
    // setItems?: React.Dispatch<React.SetStateAction<tabItem[]>>
    // onRemoveItem?: (i: string) => void
    addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType, isNested?: boolean) => boolean
    setDraggable: React.Dispatch<React.SetStateAction<boolean>>
    content: DataType.Content | undefined
    setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
    index: number
    removeTabItem: (index: number) => void
}
/*
This is the controller for tab item. It receives a boolean type 'isHover' from parent.

When 'isHover' is true, display 'editHeader', which is the controller of three buttons that used to
edit corresponding module, edit current tab content, and remove current tab.

'displayHeader' is used to display the content of the tab item.

'selected' is the selected choice from modal triggered by editHeader
*/
export const TabController = (props: TabControllerProps) => {
    const { el, index } = props
    //icon的类型
    const [tabType, setTabType] = useState(el.tabType)
    //icon的内容
    const [selected, setSelected] = useState('');
    // 控制modal显隐
    const [addModuleModalVisible, setAddModuleModalVisible] = useState(false)
    const intl = useIntl()
    const NestedDedicatedProps = useContext(nestedDedicatedContext)

    //将selected, tabType写入tab和elements
    useEffect(() => {
        console.log("selected change", selected)
        if (selected && tabType) {
            //写入tab
            if (props.setContent) {
                props.setContent((content) => {
                    const newTabItems = content?.data?.tabItems.map((item, i) => {
                        if (i === index) {
                            return {
                                ...item,
                                headData: {
                                    tabIcon: selected,
                                    tabType: tabType
                                }
                            }
                        } else {
                            return item
                        }
                    })
                    return {
                        ...content,
                        data: {
                            ...content?.data,
                            tabItems: newTabItems
                        }
                    } as DataType.Content
                })
            }

            // 写入elements
            if (NestedDedicatedProps?.setElements) {
                NestedDedicatedProps.setElements((allElements) => {
                    const item = props.content?.data?.tabItems.find((v, i) => i === index)
                    const newElements = allElements.map((v) => {
                        console.log(1022, v)
                        if (v.isSubmodule && v.name === item.name && NestedDedicatedProps.elementName === item.parentName) {
                            return {
                                ...v,
                                headData: {
                                    tabIcon: selected,
                                    tabType: tabType
                                }
                            }
                        } else {
                            return v
                        }

                    })
                    console.log(102, item, newElements)
                    return newElements
                })
            }
        }
    }, [selected, tabType])

    const endEdit = (type: string, input?: string) => {
        //not icon
        if (type !== "icon") {
            setSelected(input || '')
        }
        //update tab type
        setTabType(type)
        // console.log(tabType, input, selected)
    }

    const quitAddModule = () => setAddModuleModalVisible(false)



    //pass 
    // const onAddTabItems = (name: string, timeSeries: boolean, moduleType: ElementType) => {
    //     props.onAddSubModule!(props.name, timeSeries, moduleType, el.i)
    // }
    const editHeader = (
        <div style={{ display: 'flex', marginTop: "-12px", right: 0, }}>

            {/* 添加子模块 */}
            <Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module6" })}>
                <Button icon size='small' className="tab-controller-button"
                    onClick={() => {
                        setAddModuleModalVisible(true)
                        props.setDraggable(() => false)
                    }
                    }>
                    <FileAddOutlined />
                </Button>
            </Tooltip>

            {/*添加封面  */}
            <TabItemSelection
                selected={selected}
                setSelected={setSelected}
                endEdit={endEdit} />

            {/* 删除子模块 */}
            <Tooltip title={intl.formatMessage({ id: "gallery.component.general23" })}>
                <Button icon size='small' className="tab-controller-button"
                    onClick={() => props.removeTabItem(index)}
                >
                    <DeleteOutlined />
                </Button>
            </Tooltip>

        </div>)

    const displayHeader = () => {
        console.log(130, el.tabIcon)
        //get content from tabContent
        let headerContent: any = getChoiceElement(el.headData?.tabIcon || "")

        const className = (tabType === "text") ? "tab-text" : "display-content"
        //calculate fontSize based on the minimal of tab's dimension (width/height)
        const fontSize = (tabType === "text") ? `${el.minDim / 4}px` : `${el.minDim / 2}px`
        if (props.editable && selected) {
            //get content from newly created information
            headerContent = getChoiceElement(selected as tabContentChoice)
        }
        // console.log(el.i, selected)
        return (<span className={className}
            style={{ fontSize: fontSize }}
        >
            {headerContent}
        </span>)
    }

    return (
        <div style={{ bottom: 0, top: 0 }}>

            {/* 3个小图标 */}
            {props.editable && props.isHover ? editHeader : <div style={{ marginTop: "-12px", height: "24px" }} />}

            {/* 封面图标 */}
            <div>
                {displayHeader()}
            </div>

            <AddModuleModal
                onAddSubModule={props.onAddSubModule}
                visible={addModuleModalVisible}
                onQuit={quitAddModule}
                addElement={props.addElement}
                setDraggable={props.setDraggable}
            />
        </div>
    )
}