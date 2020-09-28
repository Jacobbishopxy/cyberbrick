/**
 * Created by Jacob Xie on 9/28/2020.
 */

import React from 'react'

import { Dashboard } from "@/components/Gallery/Dashboard"
import { GalleryDataType } from "@/components/Gallery"
import * as GalleryService from "@/services/gallery"

export default () => {

  const saveTemplate = async (template: GalleryDataType.Template) =>
    GalleryService.updateTemplateElements(template as GalleryAPI.Template)

  const updateElementContent = async (categoryName: string, content: GalleryDataType.Content) =>
    GalleryService.saveContentInCategory(categoryName, content as GalleryAPI.Content)

  return (
    <Dashboard
      fetchDashboardNames={ GalleryService.getAllDashboardsName }
      fetchDashboard={ GalleryService.getDashboardCategoryMarksAndTemplateByName }
      fetchTemplate={ GalleryService.getTemplateElements }
      saveTemplate={ saveTemplate }
      fetchElementContent={ GalleryService.getElementLatestContent }
      updateElementContent={ updateElementContent }
    />
  )
}

