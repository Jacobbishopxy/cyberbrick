/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, {useEffect, useState} from 'react'
import {Progress} from 'antd'
import ProList from '@ant-design/pro-list'

import * as innService from "@/services/inn"


const listGenerator = (data?: InnAPI.Update[]) =>
  data ? data.map(d => ({
    title: d.title,
    content: (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{width: 200}}>
          <div>{d.data}</div>
          <Progress percent={80}/>
        </div>
      </div>
    )
  })) : undefined


export default () => {

  const [data, setData] = useState<InnAPI.Update[]>()

  useEffect(() => {
    innService.getAllUpdate().then(setData)
  }, [])

  return (
    <ProList<any>
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
      }}
      metas={{
        title: {},
        subTitle: {},
        type: {},
        avatar: {},
        content: {},
        actions: {},
      }}
      headerTitle={""}
      dataSource={listGenerator(data)}
      renderItem={(item) => item}
    />
  )
}

