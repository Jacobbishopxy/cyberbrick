/**
 * Created by Jacob Xie on 1/14/2021
 */

import {ColumnsType} from "antd/lib/table/interface"
import _ from "lodash"
import moment from "moment"

import {DataSelectedType, DisplayType, GeneralTableConfigInterface} from "./data"


export const getColumnsFromRawData = (data0: Record<string, any>,
                                      type: DataSelectedType): ColumnsType<any> => {

  switch (type) {
    case "dataset":
      return _.keys(data0).map((k: string) => ({
        key: k,
        title: k,
        dataIndex: k
      }))
    case "file":
      return _.keys(data0).map((k: string) => ({
        key: k,
        title: data0[k],
        dataIndex: k
      }))
  }
}


const genDisplayConfig = (data: Record<string, any>[],
                          config: GeneralTableConfigInterface,
                          type: DataSelectedType) => {
  switch (type) {
    case "dataset":
      return _.reduce(config.display, (acc: Record<string, any>, v: DisplayType) => {
        return {...acc, [v.column]: v.type}
      }, {})
    case "file":
      const fileKeyMap = _.invert(data[0])
      return _.reduce(config.display, (acc: Record<string, any>, v: DisplayType) => {
        return {...acc, [fileKeyMap[v.column]]: v.type}
      }, {})
  }
}


export const transformRawData = (data: Record<string, any>[],
                                 config: GeneralTableConfigInterface,
                                 type: DataSelectedType): Record<string, any>[] => {
  const display = genDisplayConfig(data, config, type)

  return data.map((i, idx) => {
    const trans = _.transform(i, (r: Record<string, any>, v: any, k: string) => {
      if (display[k] === "date")
        r[k] = moment(v).format("YYYY-MM-DD") || undefined
      else if (display[k] === "number")
        r[k] = (+v).toFixed(2) || undefined
      else if (display[k] === "percent")
        r[k] = `${(+v * 100).toFixed(2)} %` || undefined
      else
        r[k] = v
    })

    return {...trans, key: idx}
  })
}

