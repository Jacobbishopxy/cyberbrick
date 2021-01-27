/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'
import ProForm from '@ant-design/pro-form'

import {DisplayForm} from "@/components/Gallery/ModulePanel/Collections/graph/utils/DisplayForm"


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
      <DisplayForm mixin={"lineScatter"} columns={columns}/>
    </ProForm>
  )
}

