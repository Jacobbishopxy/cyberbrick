/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, useContext } from "react"
import { Empty, message, Tabs, Modal } from "antd"
import _ from "lodash"

import * as DataType from "../../GalleryDataType"
import { ContainerTemplate, ContainerTemplateRef } from "./ContainerTemplate"
import { FormattedMessage } from "umi"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { useForm } from "antd/es/form/Form"

import { DashboardContext } from "../DashboardContext"
const routeConfiguration = "/gallery/configuration"
export interface ContainerProps {
    initialSelected?: string[] | undefined

    selectedCategoryName: string
    dashboardInfo: DataType.Dashboard
    onSelectPane: (templateId: string) => void
    fetchElements: (templateId: string, isSubmodule?: boolean) => Promise<DataType.Template>
    // fetchElementContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchElementContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
    setNewestContent: (content: DataType.Content) => void
    fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
    fetchTableListFn: (id: string) => Promise<string[]>
    fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
    fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
}

export interface ContainerRef {
    startFetchElements: () => void
    startFetchAllContents: () => void
    newElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
    fetchTemplate: () => void
    saveTemplate: () => DataType.Template | undefined
}

export interface ShouldElementFetch {
    eleId: string | undefined
    shouldStartFetch: boolean
}

interface SelectedPane {
    id: string
    index: number
    name: string
}

// get selected pane, default first template ID
const getSelectedPane = (templates: DataType.Template[], initId?: string) => {
    if (templates && templates.length > 0) {
        if (initId) {
            const r = _.find(templates, { id: initId })
            if (r) return { id: r.id!, index: r.index!, name: r.name! }
        }
        return { id: templates[0].id!, index: 0, name: templates[0].name }
    }
    return undefined
}

/**
 * dashboard's container, containing custom modules
 *
 * container: [...template[]]; template: [...element[]]; element: module
 */
export const Container = forwardRef((props: ContainerProps, ref: React.Ref<ContainerRef>) => {
    const ctRef = useRef<ContainerTemplateRef>(null)
    const dashboardContextProps = useContext(DashboardContext)

    const templates = _.orderBy(props.dashboardInfo.templates, ["index"])

    //维度下标
    const [selectedPane, setSelectedPane] = useState<SelectedPane>()
    //templatee（维度）全部内容
    const [template, setTemplate] = useState<DataType.Template>()
    const [shouldEleFetch, setShouldEleFetch] = useState<number>(1)
    //该维度下的全部elements
    const [elements, setElements] = useState<DataType.Element[]>([])

    //是否跳转tab的modal的显隐变量
    const [isTabModal, setIsTabModal] = useState(false)

    // 变化中的维度id，目前只作用于保存是否跳转的维度的id。
    const [templateChangingId, setTemplateChangingId] = useState<string | undefined>('')
    //根据维度id，获取维度信息。
    const tabOnChange = (id?: string) => {
        setTemplateChangingId(id);
        console.log(4222, dashboardContextProps?.edit)
        if (dashboardContextProps?.edit) {
            setIsTabModal(true)
        } else {
            setSelectedPane(getSelectedPane(templates, id))
        }
    }
    useEffect(() => {
        console.log(422, dashboardContextProps?.edit)
    }, [dashboardContextProps?.edit])
    function onOk() {
        console.log(106, templateChangingId)
        setSelectedPane(getSelectedPane(templates, templateChangingId))
        setIsTabModal(false)
        if (dashboardContextProps?.setEdit) {
            dashboardContextProps?.setEdit(() => false)
        }
    }

    //elements更新时，更新contents，目前只有删除会起作用，添加和修改都无法更新contents，因为只有删除才知道要对contents做什么具体的操作。
    // 更新逻辑：allContent中的name不在elemens中就代表已经被删除。
    useEffect(() => {
        const contentNames = dashboardContextProps?.allContent?.map((content) => content.element?.name)
        const elementNames = elements.map((el) => el.name)
        const newAllContent = dashboardContextProps?.allContent?.filter((content, i) => {
            if (contentNames && contentNames.length > 0) {
                return elementNames.includes(contentNames[i] as string)
            }
            return false
        })
        if (dashboardContextProps?.setAllContent) {
            dashboardContextProps?.setAllContent(() => newAllContent)
        }
    }, [elements])

    useEffect(() => {
        if (props.initialSelected && props.initialSelected?.length >= 2) {
            tabOnChange(props.initialSelected[2])
        } else {
            tabOnChange()
        }
    }, [props.dashboardInfo])

    /**
     * fetch template (with elements) when switching dashboard or it's tabs
     */
    //切换仪表盘时，会获得默认的第一个templates（维度）
    useEffect(() => {
        if (selectedPane) {
            //!false没起作用
            props.fetchElements(selectedPane.id, false).then(res => {

                console.log(92, res)
                setTemplate(() => res)
                console.log(922, res)
                setElements(res.elements)
            })
            props.onSelectPane(selectedPane.id)
        }
    }, [selectedPane])
    // console.log(125, selectedPane)
    //仪表盘从模板copy时使用
    const startFetchElements = () => {
        if (selectedPane)
            props.fetchElements(selectedPane.id).then(res => {
                setTemplate(res)
                setElements(res.elements)
                console.log(922, res)
            }
            )
    }

    const startFetchAllContents = () => {
        if (selectedPane) {
            //update the shoudEleFetch count
            // let length = template!.elements?.length || 0
            // let newArray = Array(length).fill(0)
            // for (let i = 0; i < length; i++) {
            //   newArray[i] = shouldEleFetch[i] + 1 || 1
            // }
            // // console.log(newArray)
            // setShouldEleFetch(newArray)
            setShouldEleFetch(el => el + 1)
        }
    }

    const newElement = (name: string, timeSeries: boolean, elementType: DataType.ElementType) => {
        if (selectedPane) {
            const rf = ctRef.current
            if (rf) rf.newElement(name, timeSeries, elementType)
        }
    }

    const fetchTemplate = () => {
        if (selectedPane)
            props.fetchElements(selectedPane.id).then(res => {
                setTemplate(res)
                setElements(res.elements)
                console.log(9222, res)
            })
    }

    const saveTemplate = () => {
        if (selectedPane) {
            const rf = ctRef.current

            if (rf && template) {
                const e = rf.saveElements()
                return { ...template, elements: e }
            }
        }
        return template
    }

    useImperativeHandle(ref, () => ({
        startFetchElements,
        startFetchAllContents,
        newElement,
        fetchTemplate,
        saveTemplate
    }))

    /**
     * template's changing triggers `startFetchAllContents`
     */
    useEffect(() => {
        console.log(191, template)
        if (ctRef.current && template) {
            startFetchAllContents()
        }
    }, [template])

    //给content加入公司信息（dashboard）和行业信息（category）
    const setNewestContent = (ctt: DataType.Content) => {
        console.log(180, props.dashboardInfo)
        const category = {
            name: props.dashboardInfo.category?.name
        } as DataType.Category
        const dashboardInfo: DataType.Dashboard = {
            ...props.dashboardInfo
        }
        props.setNewestContent({ ...ctt, dashboardInfo, category })
    }

    const genPane = (t: DataType.Template) => {
        if (ctRef && t.id === selectedPane?.id && template) {
            console.log(188, t)
            const parentInfo = {
                selectedCategoryName: props.selectedCategoryName,
                dashboardInfo: props.dashboardInfo,
                templateInfo: t
            }

            return <ContainerTemplate
                parentInfo={parentInfo}
                elements={elements}
                setElements={setElements}
                //网络请求获取模板具体内容。
                // elementFetchContentFn={props.fetchElementContentFn}
                elementFetchContentDatesFn={props.fetchElementContentDatesFn}
                setNewestContent={setNewestContent}
                elementFetchStoragesFn={props.fetchStoragesFn}
                elementFetchTableListFn={props.fetchTableListFn}
                elementFetchTableColumnsFn={props.fetchTableColumnsFn}
                elementFetchQueryDataFn={props.fetchQueryDataFn}
                ref={ctRef}
                shouldEleFetch={shouldEleFetch}
            />
        }
        return <></>
    }

    const DisplayTabPane = templates.map(t =>
        <Tabs.TabPane
            tab={t.name}
            key={t.id}
        >
            {genPane(t)}
        </Tabs.TabPane>
    )

    const EmptyPane = <Empty
        image={null}
        description={
            <span>
                <ExclamationCircleOutlined />
                <FormattedMessage id="gallery.component.dashboard-container2" />
                <a href={`${routeConfiguration}`}>
                    <FormattedMessage id="gallery.component.dashboard-config-table1" /></a>
                <FormattedMessage id="gallery.component.dashboard-container3" />

            </span>
        }
    >
    </Empty>

    return useMemo(
        () => {
            console.log(264, DisplayTabPane)
            return (
                <div>
                    <Tabs
                        onChange={tabOnChange}
                        activeKey={selectedPane?.id}
                        destroyInactiveTabPane
                    // onTabClick={tabOnClick}
                    >
                        {
                            templates.length ? DisplayTabPane : EmptyPane
                        }
                    </Tabs>
                    <Modal
                        // focusTriggerAfterClose={false}
                        title={'提示'}
                        visible={isTabModal}
                        onOk={onOk}
                        onCancel={() => { setIsTabModal(false) }}
                        closable={false}
                    >
                        <p>内容未保存，是否离开？</p>
                    </Modal>
                </div>
            )
        }, [props.dashboardInfo, template, elements, isTabModal, dashboardContextProps?.edit])
})

Container.defaultProps = {} as Partial<ContainerProps>

