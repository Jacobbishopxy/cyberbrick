/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useEffect, useState} from 'react'
import {Table, Tabs} from "antd"
import _ from "lodash"
import {ColumnsType} from "antd/lib/table/interface"


const dataSource = {
  "core": [
    {
      "date": 2015,
      "val0": 2,
      "val1": "foo"
    },
    {
      "date": 2016,
      "val0": 1,
    },
    {
      "date": 2018,
      "val0": 3,
      "val1": "bar"
    },
  ],
  // "extra": [
  //   {
  //     "date": 20200101,
  //     "val0": "halo",
  //   },
  //   {
  //     "date": 20200601,
  //     "val0": 1,
  //   },
  //   {
  //     "date": 20201201,
  //     "val0": "user",
  //   },
  // ],
}


interface FooterSelectorProps {
  tabs: string[]
  onChange: (tab: string) => void
}

const FooterSelector = (props: FooterSelectorProps) => {
  const {tabs} = props

  return tabs.length > 1 ?
    <Tabs onChange={props.onChange}>
      {
        tabs.map(t => <Tabs.TabPane tab={t} key={t}/>)
      }
    </Tabs> :
    <></>
}


interface FlexTableProps {
  data: Record<string, any[]>
  showHeader: boolean
  showBorder: boolean
  showPagination: boolean
}

const FlexTable = (props: FlexTableProps) => {

  const [columns, setColumns] = useState<ColumnsType>([])
  const [data, setData] = useState<any[]>([])

  const setAll = (d: any[]) => {
    setColumns(_.keys(d[0]).map((k: string) => ({
      key: k,
      title: k,
      dataIndex: k
    })))
    setData(d)
  }

  useEffect(() => setAll(props.data[_.keys(props.data)[0]]), [])

  const footerTabOnChange = (tab: string) => setAll(props.data[tab])

  return (
    <Table
      columns={columns}
      dataSource={data}
      showHeader={props.showHeader}
      bordered={props.showBorder}
      pagination={props.showPagination ? undefined : false}
      footer={
        () => <FooterSelector tabs={_.keys(props.data)} onChange={footerTabOnChange}/>
      }
    />
  )
}

export default () => {

  return (
    <FlexTable
      data={dataSource}
      showHeader
      showBorder
      showPagination //={false}
    />
  )
}

