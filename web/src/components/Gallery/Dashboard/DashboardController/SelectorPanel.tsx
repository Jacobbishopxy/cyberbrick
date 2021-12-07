/**
 * Created by Jacob Xie on 1/29/2021
 */

import React, { useEffect, useState, useRef, useContext } from "react"
import { Cascader } from "antd"
import { CascaderOptionType, CascaderValueType } from "antd/lib/cascader"

import * as DataType from "../../GalleryDataType"
import IsSavemodal from "../IsSavemodal"
import { isSaveModalRef } from "../IsSavemodal"

import { DashboardContext } from "../DashboardContext"
/**
 * initValue?: holding previous selected value (often used with local storage)
 * isMainController?: if is main controller, cascader is able to generate 2nd level text
 * categories: list of category, 1st level of select options
 * categoryOnSelect: generate 2nd level of select options
 * dashboardOnSelect?: generate 3rd level of select options
 * onChange?: tell parent component changes are made (often used with local storage)
 * onSelectFinish?: inform parent component the last level of selection
 * style?: style
 * size?: size
 */
export interface SelectorPanelProps {
    initValue?: string[]
    isMainController?: boolean
    categories: DataType.Category[]
    categoryOnSelect: (name: string) => Promise<DataType.Category>
    dashboardOnSelect?: (id: string) => Promise<DataType.Dashboard>
    onChange?: (value: string[]) => void
    onSelectFinish?: (value: string) => void
    style?: React.CSSProperties
    size?: "large" | "middle" | "small"
    isCopy?: boolean
}

export const SelectorPanel = (props: SelectorPanelProps) => {

    const [initValue, setInitValue] = useState<string[] | undefined>(props.initValue)
    const [options, setOptions] = useState<CascaderOptionType[]>()
    const [selected, setSelected] = useState<string>()

    // 
    console.log(46, props.initValue)
    useEffect(() => setInitValue(props.initValue), [props.initValue])

    useEffect(() => {
        if (props.onSelectFinish && selected) props.onSelectFinish(selected)
    }, [selected])

    useEffect(() => {
        const opt = props.categories.map(c => ({
            value: c.name,
            label: c.name,
            isLeaf: false
        }))

        enhanceOptions(opt).then(setOptions)

    }, [props.categories])

    const dashboardContextProps = useContext(DashboardContext)
    const [modalData, setModalData] = useState<any>()
    const modalRef = useRef<isSaveModalRef>()

    const onChange = (value: CascaderValueType) => {

        if (!props.isCopy && dashboardContextProps?.edit) {
            if (modalRef.current) {
                modalRef.current.setIsModal(true)
                setModalData({
                    value
                })
            }
        }
        else {
            console.log(65, dashboardContextProps, props)
            switchCompany({ value })
        }
    }

    function switchCompany({ value }) {
        const v = value as string[]
        setInitValue(v)
        if (props.onChange) props.onChange(v)
        if (props.onSelectFinish) {
            if (props.dashboardOnSelect)
                setSelected(value[2] as string)
            else
                setSelected(value[1] as string)
        }
        if (!props.isCopy) {
            if (dashboardContextProps?.setEdit) {
                dashboardContextProps?.setEdit(() => false)
            }
        }
    }
    const setOptionsLevel2 = async (cat?: string) => {
        if (cat) {
            const category = await props.categoryOnSelect(cat)
            return category.dashboards?.map(d => ({
                value: d.id,
                label: d.name,
                isLeaf: !props.dashboardOnSelect
            }))
        }
        return []
    }

    const setOptionsLevel3 = async (dsb?: string) => {
        if (dsb) {
            const dashboard = await props.dashboardOnSelect!(dsb)
            return dashboard.templates?.map(t => ({
                value: t.id,
                label: t.name
            }))
        }
        return []
    }

    const enhanceOptions = async (opt: CascaderOptionType[]) => {
        if (props.isMainController) {
            const v = initValue ? initValue[0] : undefined
            const d = await setOptionsLevel2(v)

            return opt.map(i =>
                i.value === v ? { ...i, children: d } : i
            )
        } else
            return opt
    }

    const loadData = async (selectedOptions?: CascaderOptionType[]) => {
        console.log(106, selectedOptions)
        if (selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1]
            targetOption.loading = true

            if (selectedOptions.length === 1) {
                const dashboardOptions = await setOptionsLevel2(targetOption.value as string)
                if (dashboardOptions) {
                    targetOption.loading = false
                    targetOption.children = dashboardOptions
                    setOptions([...(options ? options : [])])
                }
            }

            if (selectedOptions.length === 2) {
                const templateOptions = await setOptionsLevel3(targetOption.value as string)
                console.log(templateOptions)
                if (templateOptions) {
                    targetOption.loading = false
                    targetOption.children = templateOptions
                    setOptions([...(options ? options : [])])
                }
            }
        }
    }

    return (
        <div>
            <Cascader
                value={initValue}
                options={options}
                loadData={loadData}
                onChange={onChange}
                // changeOnSelect
                style={props.style}
                size={props.size || "middle"}
            />
            {
                !props.isCopy ? <IsSavemodal
                    modalData={modalData}
                    onOk={switchCompany}
                    ref={modalRef}
                ></IsSavemodal> : <></>
            }
        </div >
    )
}

SelectorPanel.defaultProps = {
    isMainController: false
} as Partial<SelectorPanelProps>

