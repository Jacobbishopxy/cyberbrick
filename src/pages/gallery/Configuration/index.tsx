/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useEffect, useState } from 'react'
import { Divider } from "antd"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"
import { CategoryConfigTable, DashboardConfigTable } from "@/components/Gallery/Configuration"


export default () => {

  const [dataCategory, setDataCategory] = useState<DataType.Category[]>([])
  const [dataDashboard, setDataDashboard] = useState<DataType.Dashboard[]>([])
  const [categoryRefresh, setCategoryRefresh] = useState<number>(0)
  const [dashboardRefresh, setDashboardRefresh] = useState<number>(0)

  const getAllCategories = () =>
    GalleryService.getAllCategoriesWithoutContents()

  const getAllDashboards = () =>
    GalleryService.getAllDashboardsTemplate()

  useEffect(() => {
    getAllCategories().then(res => setDataCategory(res as DataType.Category[]))
  }, [categoryRefresh])

  useEffect(() => {
    getAllDashboards().then(res => setDataDashboard(res as DataType.Dashboard[]))
  }, [dashboardRefresh])

  const refreshCat = () => setCategoryRefresh(categoryRefresh + 1)
  const refreshDsb = () => setDashboardRefresh(dashboardRefresh + 1)

  const saveCategory = (name: string, description?: string) =>
    GalleryService
      .saveCategory({ name, description })
      .then(refreshCat)

  const modifyDashboardDescription = (name: string, description: string) =>
    GalleryService
      .modifyDashboardDescription({ name, description })
      .then(refreshCat)

  const saveMark = (categoryName: string, mark: DataType.Mark) =>
    GalleryService
      .saveCategoryMark(categoryName, mark as GalleryAPI.Mark)
      .then(refreshCat)

  const deleteMark = (categoryName: string, markName: string) =>
    GalleryService
      .deleteMarkInCategory(categoryName, markName)
      .then(refreshCat)

  const saveTag = (categoryName: string, tag: DataType.Tag) =>
    GalleryService
      .saveCategoryTag(categoryName, tag as GalleryAPI.Tag)
      .then(refreshCat)

  const deleteTag = (categoryName: string, tagName: string) =>
    GalleryService
      .deleteTagInCategory(categoryName, tagName)
      .then(refreshCat)

  const newDashboard = (categoryName: string, dashboard: DataType.Dashboard) =>
    GalleryService
      .newDashboardAttachToEmptyCategory(categoryName, dashboard as GalleryAPI.Dashboard)
      .then(refreshCat)

  const saveTemplate = (dashboardName: string, template: DataType.Template) =>
    GalleryService
      .saveTemplateInDashboard(dashboardName, template as GalleryAPI.Template)
      .then(refreshDsb)

  const deleteTemplate = (dashboardName: string, templateName: string) =>
    GalleryService
      .deleteTemplateInDashboard(dashboardName, templateName)
      .then(refreshDsb)

  return (
    <>
      <CategoryConfigTable
        data={ dataCategory }
        saveCategory={ saveCategory }
        modifyDashboardDescription={ modifyDashboardDescription }
        saveMark={ saveMark }
        deleteMark={ deleteMark }
        saveTag={ saveTag }
        deleteTag={ deleteTag }
        newDashboard={ newDashboard }
      />
      <Divider/>
      <DashboardConfigTable
        data={ dataDashboard }
        saveTemplate={ saveTemplate }
        deleteTemplate={ deleteTemplate }
      />
    </>
  )
}

