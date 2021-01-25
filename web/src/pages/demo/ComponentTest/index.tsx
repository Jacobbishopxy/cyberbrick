/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'
import ProForm from '@ant-design/pro-form'

import {AxisSelectorForm} from "@/components/Gallery/ModulePanel/Collections/graph/utils/AxisSelectorForm"


const columns = [
  "Jacob",
  "Sam",
  "MZ",
  "John",
  "Gary",
  "Lucas",
  "Larry",
  "Adam",
]


export default () => {

  const onFinish = async (values: any) => console.log(values)


  return (
    <ProForm onFinish={onFinish}>
      <AxisSelectorForm mixin={"lineScatter"} columns={columns}/>
    </ProForm>
  )
}

