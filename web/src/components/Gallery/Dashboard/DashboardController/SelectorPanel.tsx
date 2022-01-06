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
import testData from './allCategoryNameDashboardDimensionality'
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
  isCopyOfIsTemplate?: string
  setSelectedCategoryName: (s: string) => void
}

export const SelectorPanel = (props: SelectorPanelProps) => {
  const dashboardContextProps = useContext(DashboardContext)
  // 当前所选公司
  const [value, setValue] = useState<string[] | undefined>(props.initValue)
  // 级联的数据源
  const [options, setOptions] = useState<CascaderOptionType[]>()
  const [selected, setSelected] = useState<string>()
  // 要传给modal的数据
  const [modalData, setModalData] = useState<any>()
  const modalRef = useRef<isSaveModalRef>()
  // 全部的行业和公司
  const [allCategoryDashborad, setAllCategoryDashborad] = useState([])

  // 初始化【当前所选公司】
  useEffect(() => setValue(props.initValue), [props.initValue])

  // 更新【options】
  useEffect(() => {
    setOptions(() => {

      const isTemplate = props.isCopy ? props.isCopyOfIsTemplate === DataType.CategoryTypeEnum.temp_lib : dashboardContextProps?.isTemplate

      // 根据仪表盘或模板库获得行业、公司、维度树形结构
      const options = allCategoryDashborad?.filter((v) => isTemplate ? v.type === DataType.CategoryTypeEnum.temp_lib : v.type === DataType.CategoryTypeEnum.dashboard).map((v) => {
        return {
          value: v.name,
          label: v.name,
          isLeaf: false,
          children: v.dashboards.map((va) => {
            return {
              value: va.id,
              label: va.name,
              isLeaf: props.isCopy ? false : true,
              children: va.templates.map((val) => {
                return {
                  value: val.id,
                  label: val.name,
                  isLeaf: true
                }
              })
            }
          })
        }
      })
      // 如果是非拷贝，需要删除维度。
      if (!props.isCopy) {
        options.forEach((v) => {
          v.children.forEach((va) => {
            delete va.children
          })
        })
      }

      console.log(189, options)
      return options

    })
  }, [allCategoryDashborad, props.isCopyOfIsTemplate])

  useEffect(() => {
    if (props.onSelectFinish && selected) props.onSelectFinish(selected)
  }, [selected])

  // useEffect(() => {
  //   const opt = props.categories.map(c => ({
  //     value: c.name,
  //     label: c.name,
  //     isLeaf: false
  //   }))
  //   console.log(46, props.categories)
  //   enhanceOptions(opt).then(setOptions)

  // }, [props.categories])


  const onChange = (value: CascaderValueType) => {
    console.log(688, value)
    // 如果是copy时的切换公司
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
      // 如果时copy模块时不需要更改公司名
      if (!props.isCopy) {
        // 更改公司名
        props.setSelectedCategoryName(value[0] as string)
      }

    }
  }

  function switchCompany({ value }) {
    const v = value as string[]
    // 更改【显示值】
    setValue(v)
    // 执行父组件的业务
    if (props.onChange) props.onChange(v)
    if (props.onSelectFinish) {
      console.log(128, props.dashboardOnSelect, value)
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



  // 全部的行业和公司：根据是否copy和是否模板库
  useEffect(() => {
    dashboardContextProps?.getAllCategoriesDashboardsTemplates().then((res) => {
      if (res && res.length > 0) {

        setAllCategoryDashborad(res)
      }

    })
  }, [])

  return (
    <div>
      <Cascader
        value={value}
        options={options}
        // loadData={loadData}
        onChange={onChange}
        // changeOnSelect
        style={props.style}
        size={props.size || "middle"}
        showSearch={true}
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

