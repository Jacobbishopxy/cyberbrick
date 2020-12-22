/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useEffect, useState} from 'react'
import {message, Tabs} from "antd"
import {DashboardOutlined, DatabaseOutlined, TagsOutlined} from "@ant-design/icons"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"
import {CategoryConfigTable, DashboardConfigTable, StorageConfigTable} from "@/components/Gallery/Configuration"


const getAllCategories = () => GalleryService.getAllCategoriesWithoutContents()

const getAllDashboards = () => GalleryService.getAllDashboardsTemplate()

const getAllStorages = () => GalleryService.getAllStorages()

type TabPaneType = "Category" | "Dashboard" | "Storage"


export default () => {

  const [dataCategory, setDataCategory] = useState<DataType.Category[]>([])
  const [dataDashboard, setDataDashboard] = useState<DataType.Dashboard[]>([])
  const [storage, setStorage] = useState<DataType.Storage[]>([])
  const [activeKey, setActiveKey] = useState<TabPaneType>("Category")

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
      .saveCategory({name, description})
      .then(refreshCat)

  const saveDashboards = (categoryName: string, dashboards: DataType.Dashboard[]) => {
    const data = dashboards.map(d => ({
      ...d,
      category: {name: categoryName}
    }) as GalleryAPI.Dashboard)
    return GalleryService.saveDashboards(data).then(refreshCat)
  }

  const saveMarks = (categoryName: string, marks: DataType.Mark[]) => {
    const data = marks.map(m => ({
      ...m,
      category: {name: categoryName}
    }) as GalleryAPI.Mark)
    return GalleryService.saveMarks(data).then(refreshCat)
  }

  const saveTags = (categoryName: string, tags: DataType.Tag[]) => {
    const data = tags.map(t => ({
      ...t,
      category: {name: categoryName}
    }) as GalleryAPI.Tag)
    return GalleryService.saveTags(data).then(refreshCat)
  }

  const saveTemplates = (dashboardId: string, templates: DataType.Template[]) =>
    GalleryService
      .saveTemplatesInDashboard(dashboardId, templates as GalleryAPI.Template[])
      .then(refreshCat)

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
        if (res) message.success(`Database: ${id} is connected!`)
        else message.error(`Database: ${id} is disconnected!`)
      })

  const reloadConnection = (id: string) =>
    GalleryService
      .reloadConnection(id)
      .then(res => message.info(res))


  return (
    <Tabs
      centered
      defaultActiveKey={activeKey}
      onChange={v => setActiveKey(v as TabPaneType)}
    >
      <Tabs.TabPane
        tab={<span> <TagsOutlined/> Category</span>}
        key="Category"
      >
        <CategoryConfigTable
          data={dataCategory}
          saveCategory={saveCategory}
          saveDashboards={saveDashboards}
          saveMarks={saveMarks}
          saveTags={saveTags}
        />
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={<span> <DashboardOutlined/> Dashboard</span>}
        key="Dashboard"
      >
        <DashboardConfigTable
          data={dataDashboard}
          saveTemplates={saveTemplates}
        />
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={<span> <DatabaseOutlined/> Storage</span>}
        key="Storage"
      >
        <StorageConfigTable
          data={storage}
          saveStorage={saveStorage}
          deleteStorage={deleteStorage}
          checkConnection={checkConnection}
          reloadConnection={reloadConnection}
        />
      </Tabs.TabPane>
    </Tabs>
  )
}

