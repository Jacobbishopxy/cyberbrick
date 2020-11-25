/**
 * Created by Jacob Xie on 9/28/2020.
 */

import React from 'react'

import {Dashboard} from "@/components/Gallery/Dashboard"
import {GalleryDataType} from "@/components/Gallery"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"

export default () => {

  const fetchDashboards = () =>
    GalleryService.getAllDashboardsTemplate()

  const fetchDashboard = (dashboardName: string) =>
    GalleryService.getDashboardCategoryMarksAndTemplateByName(dashboardName) as Promise<DataType.Dashboard>

  const fetchTemplate = (dashboardName: string, templateName: string) =>
    GalleryService.getTemplateElements(dashboardName, templateName) as Promise<DataType.Template>

  const saveTemplate = (template: GalleryDataType.Template) =>
    GalleryService.updateTemplateElements(template as GalleryAPI.Template)

  const copyTemplate = (copy: GalleryDataType.CopyTemplateElements) =>
    GalleryService.copyTemplateElements(copy)

  const fetchElementContent = (id: string, date?: string, markName?: string) =>
    GalleryService.getElementContent(id, date, markName) as Promise<DataType.Element>

  const fetchElementContentRemote = (id: string, option: GalleryDataType.Read) =>
    GalleryService.read(id, option as GalleryAPI.Read)

  const fetchElementContentDates = (id: string, markName?: string) =>
    GalleryService.getElementContentDates(id, markName) as Promise<DataType.Element>

  const updateElementContent = (categoryName: string, content: GalleryDataType.Content) =>
    GalleryService.saveContentInCategory(categoryName, content as GalleryAPI.Content)


  return (
    <Dashboard
      markAvailable
      fetchDashboards={fetchDashboards}
      fetchDashboard={fetchDashboard}
      fetchTemplate={fetchTemplate}
      saveTemplate={saveTemplate}
      copyTemplate={copyTemplate}
      fetchElementContent={fetchElementContent}
      fetchElementContentRemote={fetchElementContentRemote}
      fetchElementContentDates={fetchElementContentDates}
      updateElementContent={updateElementContent}
    />
  )
}

