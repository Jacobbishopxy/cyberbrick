/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useEffect, useState} from 'react'

import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"
import {SelectorPanelPro} from "@/components/Gallery/Dashboard/DashboardController/SelectorPanelPro"


const fetchCategories = () =>
  GalleryService.getAllCategories() as Promise<DataType.Category[]>

const fetchCategory = (name: string) =>
  GalleryService.getCategoryDashboardByName(name) as Promise<DataType.Category>

const fetchDashboard = (id: string) =>
  GalleryService.getDashboardCategoryAndTemplate(id) as Promise<DataType.Dashboard>


export default () => {

  const [cat, setCat] = useState<DataType.Category[]>([])

  useEffect(() => {
    fetchCategories().then(setCat)
  }, [])

  return <SelectorPanelPro
    categories={cat}
    categoryOnSelect={fetchCategory}
    dashboardOnSelect={fetchDashboard}
    onChange={v => console.log(v)}
  />
}

