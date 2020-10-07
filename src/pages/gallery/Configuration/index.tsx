/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useEffect, useState } from 'react'
import { Divider } from "antd"

import * as DataType from "@/components/Gallery/DataType"
import * as GalleryService from "@/services/gallery"
import { CategoryConfigTable } from "@/components/Gallery/Configuration/CategoryConfigTable"
import { DashboardConfigTable } from "@/components/Gallery/Configuration/DashboardConfigTable"


const dataDashboard: DataType.Dashboard[] = [
  {
    name: "DevOps",
    description: "Mock",
    templates: [
      {
        name: "Language",
      },
      {
        name: "Development"
      }
    ]
  },
  {
    name: "Prod",
    description: "fake prod",
    templates: [
      {
        name: "Workflow",
      }
    ]
  },
]

const testAPI = (name: string, content?: any) =>
  console.log(name, content)

export default () => {

  const [dataCategory, setDataCategory] = useState<DataType.Category[]>([])
  const [categoryRefresh, setCategoryRefresh] = useState<number>(0)

  const getAllCategories = () =>
    GalleryService.getAllCategoriesWithoutContents()

  useEffect(() => {
    getAllCategories().then(res => setDataCategory(res as DataType.Category[]))
  }, [categoryRefresh])

  const refreshCat = () => setCategoryRefresh(categoryRefresh + 1)

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
        saveTemplate={ testAPI }
        deleteTemplate={ testAPI }
      />
    </>
  )
}

