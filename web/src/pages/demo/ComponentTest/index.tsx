/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useEffect, useState} from 'react'

import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"
import {SelectorPanel} from "@/components/Gallery/Dashboard/DashboardController/SelectorPanel"
import {ExpiryType, LocalStorageHelper} from "@/utils/localStorageHelper"


const identifier = "component-test"
const expiry = [1, "minute"] as ExpiryType
const ls = new LocalStorageHelper(identifier, {expiry})
const keySelected = "ct"

const fetchCategories = () =>
  GalleryService.getAllCategories() as Promise<DataType.Category[]>

const fetchCategory = (name: string) =>
  GalleryService.getCategoryDashboardByName(name) as Promise<DataType.Category>

// const fetchDashboard = (id: string) =>
//   GalleryService.getDashboardCategoryAndTemplate(id) as Promise<DataType.Dashboard>


export default () => {

  const [value, setValue] = useState<string[]>()
  const [cat, setCat] = useState<DataType.Category[]>([])

  useEffect(() => {

    const initSelected = ls.get(keySelected)

    if (initSelected) setValue(JSON.parse(initSelected.data))

    fetchCategories().then(setCat)


  }, [])


  const onChange = (v: string[]) => {
    ls.add(keySelected, JSON.stringify(v))
  }

  return <SelectorPanel
    initValue={value}
    categories={cat}
    categoryOnSelect={fetchCategory}
    // dashboardOnSelect={fetchDashboard}
    onChange={onChange}
    onSelectFinish={v => console.log("onSelectFinish", v)}
    style={{width: 400}}
  />
}

