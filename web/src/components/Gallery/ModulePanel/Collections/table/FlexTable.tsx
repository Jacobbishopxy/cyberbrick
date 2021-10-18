/**
 * Created by Jacob Xie on 12/23/2020
 */

import { useEffect, useState } from "react"
import { Table } from "antd"
import { ColumnsType } from "antd/lib/table/interface"
import { HotTable } from "@handsontable/react"

import * as DataType from "../../../GalleryDataType"
import { DataSelectedType, GeneralTableConfigInterface } from "@/components/Gallery/Utils/data"
import { getColumnsFromRawData, transformRawDataBySourceType } from "../../../Utils/rawDataTransform"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModulePresenterField } from "../../Generator/data"
import { GeneralTableEditorField } from "./GeneralTableEditorField"
import { genHotTableProps } from "./XlsxTable"

import "handsontable/dist/handsontable.full.css"


interface FlexTableViewProps {
    content: DataType.Content
    fetchQueryData: (value: DataType.Content) => Promise<any>
    contentHeight?: number
}
/**
 * Table Content data structure:{
 * ...content,
 * storageType: pg/mongodb
 * data{
 *    source: Record(string, any) //this is for the json object to display table, or to query from pg
 *    id?: mongodb object id // if storageType is mongodb
 *    collection?: mongodb collection name // if storageType is mongodb
 *    }
 * }
 */
const FlexTableView = (props: FlexTableViewProps) => {

    const [config, setConfig] = useState<GeneralTableConfigInterface>()

    const [columns, setColumns] = useState<ColumnsType<any>>([])
    const [data, setData] = useState<Record<string, any>[]>()


    const genColumnsAndData = (rawData: Record<string, any>[],
        rawConfig: GeneralTableConfigInterface,
        type: DataSelectedType) => {
        //TODO: can't get collumn name
        if (rawData && rawConfig) {
            // console.log(rawData)
            const col = getColumnsFromRawData(rawData[0], type)
            const d = transformRawDataBySourceType(rawData, rawConfig, type)
            setColumns(col)
            setData(d)
        }
    }

    useEffect(() => {
        const c = props.content.config as GeneralTableConfigInterface
        setConfig(c)
        if (c) {
            if (c.type === "dataset") {
                const content: DataType.Content = { data: props?.content?.data?.source, date: props.content.date }
                props.fetchQueryData(content).then(res => genColumnsAndData(res, c, "dataset"))
            }
            if (c.type === "file")
                genColumnsAndData(props.content?.data?.source[0], c, "file")
        }
    }, [props.content])


    const defaultTable = (cfg: GeneralTableConfigInterface) =>
        <Table
            columns={columns}
            dataSource={data}
            showHeader={!cfg.view.includes("header")}
            bordered={!cfg.view.includes("border")}
            size="small"
            scroll={{ x: true, y: props.contentHeight ? props.contentHeight - 60 : undefined }}
            pagination={false}
        />

    const xlsxTable = (cfg: GeneralTableConfigInterface) => <HotTable
        {...genHotTableProps(props.contentHeight, cfg.view)}
        data={data}
    />

    switch (config?.style) {
        case "default":
            return defaultTable(config)
        case "xlsx":
            return xlsxTable(config)
        default:
            return <></>
    }
}


const PresenterField = (props: ModulePresenterField) => {
    console.log('Flextable')
    return props.content ?
        <FlexTableView
            content={props.content}
            fetchQueryData={props.fetchQueryData!}
            contentHeight={props.contentHeight}
        /> : <></>
}

export const FlexTable = new ModuleGenerator(GeneralTableEditorField, PresenterField).generate()

