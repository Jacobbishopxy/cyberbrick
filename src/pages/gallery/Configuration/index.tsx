/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useEffect, useState } from 'react'
import { message, Tabs } from "antd"
import { DashboardOutlined, DatabaseOutlined, TagsOutlined } from "@ant-design/icons"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"
import { CategoryConfigTable, DashboardConfigTable, StorageConfigTable } from "@/components/Gallery/Configuration"


const getAllCategories = () => GalleryService.getAllCategoriesWithoutContents()

const getAllDashboards = () => GalleryService.getAllDashboardsTemplate()

const getAllStorages = () => GalleryService.getAllStorages()

type TabPaneType = "Category" | "Dashboard" | "Storage"


export default () => {

  const [dataCategory, setDataCategory] = useState<DataType.Category[]>([])
  const [dataDashboard, setDataDashboard] = useState<DataType.Dashboard[]>([])
  const [storage, setStorage] = useState<DataType.Storage[]>([])
  const [activeKey, setActiveKey] = useState<TabPaneType>("Storage")

  const refreshCat = () =>
    getAllCategories().then(res => setDataCategory(res as DataType.Category[]))

  const refreshDsb = () =>
    getAllDashboards().then(res => setDataDashboard(res as DataType.Dashboard[]))

  const refreshSto = () =>
    getAllStorages().then(res => setStorage(res as DataType.Storage[]))

  const tabPaneOnchange = (key: string) => {
    switch (key) {
      case "Category":
        refreshCat().finally()
        break
      case "Dashboard":
        refreshDsb().finally()
        break
      case "Storage":
        refreshSto().finally()
        break
    }
  }

  useEffect(() => tabPaneOnchange(activeKey), [activeKey])

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

  const saveStorage = (storage: DataType.Storage) =>
    GalleryService
      .saveStorage(storage)
      .then(refreshSto)

  const deleteStorage = (id: string) =>
    GalleryService
      .deleteStorage(id)
      .then(refreshSto)

  const checkConnection = (id: string) =>
    GalleryService
      .testConnection(id)
      .then(res => {
        if (res) message.success(`Database: ${ id } is connected!`)
        else message.error(`Database: ${ id } is disconnected!`)
      })

  const reloadConnection = (id: string) =>
    GalleryService
      .reloadConnection(id)
      .then(res => message.info(res))


  return (
    <Tabs
      centered
      defaultActiveKey={ activeKey }
      onChange={ v => setActiveKey(v as TabPaneType) }
    >
      <Tabs.TabPane
        tab={ <span> <TagsOutlined/> Category</span> }
        key="Category"
      >
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
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={ <span> <DashboardOutlined/> Dashboard</span> }
        key="Dashboard"
      >
        <DashboardConfigTable
          data={ dataDashboard }
          saveTemplate={ saveTemplate }
          deleteTemplate={ deleteTemplate }
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={ <span> <DatabaseOutlined/> Storage</span> }
        key="Storage"
      >
        <StorageConfigTable
          data={ storage }
          saveStorage={ saveStorage }
          deleteStorage={ deleteStorage }
          checkConnection={ checkConnection }
          reloadConnection={ reloadConnection }
        />
      </Tabs.TabPane>
    </Tabs>
  )
}

