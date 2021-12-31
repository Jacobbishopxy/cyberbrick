// react
import { forwardRef, useEffect, useImperativeHandle, useState, useContext } from 'react';

// spreadJS
import * as GC from '@grapecity/spread-sheets';
import * as ExcelIO from "@grapecity/spread-excelio";
import { sjsKey, toolsKey } from '@/components/Gallery/Utils/sjsKey';
GC.Spread.Sheets.LicenseKey = ExcelIO.LicenseKey = sjsKey;
GC.Spread.Sheets.Designer.LicenseKey = toolsKey

import "@grapecity/spread-sheets-pivot-addon";
import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';
import { Designer } from '@grapecity/spread-sheets-designer-react';
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css"
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css"
import "./custom.less"
import _ from 'lodash'

// 自己
import * as DataType from "@/components/Gallery/GalleryDataType"
import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

GC.Spread.Common.CultureManager.culture('zh-cn');
// ---------------------------

export interface ExcelProps {
  editable: boolean
  elementEdit: boolean
  initialValue: string
  onSave: (v: string) => void
  content?: DataType.Content
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  styling?: string
  updateContent?: (c: DataType.Content) => void
  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
  setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  parentInfo: any
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
  //获取全部数据库
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
}

export interface ExcelRef {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  spread: any
}

export const Excel = forwardRef((props: ExcelProps, ref: React.Ref<ExcelRef>) => {
  // 自身模块是否编辑
  const [edit, setEdit] = useState(false)
  // 
  const [spread, setSpread] = useState<GC.Spread.Sheets.Workbook>()
  // 当前sheet
  // const [activeSheet, setActiveSheet] = useState<GC.Spread.Sheets.Worksheet>()
  const nestedDedicatedContextProps = useContext(nestedDedicatedContext)

  useImperativeHandle(ref, () => {
    return {
      edit,
      setEdit,
      spread
    }
  })

  // 初始化：只在第一次接收到后端数据时改变spread，往后都用spread自身导入控制。
  useEffect(() => {
    if (!_.isEmpty(spread)) {
      if (nestedDedicatedContextProps?.initValue?.data.ssjson) {
        // 后端数据导入
        spread!.fromJSON(JSON.parse(nestedDedicatedContextProps?.initValue?.data.ssjson));

        // 是否保护sheets
        spread?.sheets.forEach((v) => {
          v.options.isProtected = props.elementEdit ? false : true;
        })
      }
    }
  }, [spread, nestedDedicatedContextProps?.initValue?.data.ssjson, spread])


  const [config, setConfig] = useState(GC.Spread.Sheets.Designer.DefaultConfig)
  // 根据elementEdit设置表单是否可以编辑和导入导出
  useEffect(() => {

    if (spread) {
      // 是否保护sheets
      spread?.sheets.forEach((v) => {
        v.options.isProtected = props.elementEdit ? false : true;
      })

      // 是否隐藏【导入】
      var designerConfig = JSON.parse(JSON.stringify(GC.Spread.Sheets.Designer.DefaultConfig))
      if (!props.elementEdit) {
        delete designerConfig.fileMenu
      }
      setConfig(designerConfig)
    }
  }, [props.elementEdit])


  return (
    <Designer

      styleInfo={{ width: "100%", height: '100%' }}
      config={config}
      designerInitialized={(designer) => {

        const spread: GC.Spread.Sheets.Workbook = designer.getWorkbook()
        setSpread(spread);

      }}
    ></Designer>
  )
})

