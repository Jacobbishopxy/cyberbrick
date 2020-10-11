/**
 * Created by Jacob Xie on 9/28/2020.
 */

import React from 'react'

import { Dashboard } from "@/components/Gallery/Dashboard"
import { GalleryDataType } from "@/components/Gallery"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"

export default () => {

  const fetchDashboardNames = () =>
    GalleryService.getAllDashboardsName()

  const fetchDashboard = (dashboardName: string) =>
    GalleryService.getDashboardCategoryMarksAndTemplateByName(dashboardName) as Promise<DataType.Dashboard>

  const fetchTemplate = (dashboardName: string, templateName: string) =>
    GalleryService.getTemplateElements(dashboardName, templateName) as Promise<DataType.Template>

  const saveTemplate = (template: GalleryDataType.Template) =>
    GalleryService.updateTemplateElements(template as GalleryAPI.Template)

  const fetchElementContent = (id: string, date?: string, markName?: string) =>
    GalleryService.getElementContent(id, date, markName) as Promise<DataType.Element>

  const fetchElementContentDates = (id: string) =>
    GalleryService.getElementContentDates(id) as Promise<DataType.Element>

  const updateElementContent = (categoryName: string, content: GalleryDataType.Content) =>
    GalleryService.saveContentInCategory(categoryName, content as GalleryAPI.Content)


  return (
    <Dashboard
      markAvailable
      fetchDashboardNames={ fetchDashboardNames }
      fetchDashboard={ fetchDashboard }
      fetchTemplate={ fetchTemplate }
      saveTemplate={ saveTemplate }
      fetchElementContent={ fetchElementContent }
      fetchElementContentDates={ fetchElementContentDates }
      updateElementContent={ updateElementContent }
    />
  )
}

