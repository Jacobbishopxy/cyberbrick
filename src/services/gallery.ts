/**
 * Created by Jacob Xie on 9/18/2020.
 */

import request from "umi-request"


const base = "/api/gallery"


// Category

export const getAllCategoriesName = async (): Promise<string[]> =>
  request(`${ base }/getAllCategoriesName`)

export const getAllCategoriesWithoutContents = async (): Promise<GalleryAPI.Category[]> =>
  request(`${ base }/getAllCategoriesWithoutContents`)

export const getCategoryMarkAndTagByName = async (name: string): Promise<GalleryAPI.Category> =>
  request(`${ base }/getCategoryMarkAndTagByName?name=${ name }`)

export const getCategoryContentByName = async (name: string): Promise<GalleryAPI.Category> =>
  request(`${ base }/getCategoryContentByName?name=${ name }`)

export const saveCategory = async (category: GalleryAPI.Category): Promise<void> =>
  request(`${ base }/saveCategory`, {
    method: "post",
    data: category
  })

export const saveCategoryMark = async (categoryName: string, mark: GalleryAPI.Mark): Promise<void> =>
  request(`${ base }/saveCategoryMark?name=${ categoryName }`, {
    method: "post",
    data: mark
  })

export const saveCategoryTag = async (categoryName: string, tag: GalleryAPI.Tag): Promise<void> =>
  request(`${ base }/saveCategoryTag?name=${ categoryName }`, {
    method: "post",
    data: tag
  })


// Mark

export const getCategoriesByMarkName = async (name: string): Promise<GalleryAPI.Category[]> =>
  request(`${ base }/getCategoriesByMarkName?name=${ name }`)

export const deleteMarkInCategory = async (categoryName: string, markName: string): Promise<void> =>
  request(`${ base }/deleteMarkInCategory?categoryName=${ categoryName }&markName=${ markName }`, {
    method: "delete"
  })


// Tag

export const getCategoriesByTagName = async (name: string): Promise<GalleryAPI.Category[]> =>
  request(`${ base }/getCategoriesByTagName?name=${ name }`)

export const deleteTagInCategory = async (categoryName: string, tagName: string): Promise<void> =>
  request(`${ base }/deleteTagInCategory?categoryName=${ categoryName }&tagName=${ tagName }`, {
    method: "delete"
  })


// Content

export const getContentsInCategoryByElementTypeAndMarkAndTags =
  async (categoryName: string,
         elementType?: string,
         markName?: string,
         tagNames?: string[],
         pagination?: [number, number]): Promise<GalleryAPI.Content> => {
    let path = `${ base }/getContentsInCategoryByElementTypeAndMarkAndTags?categoryName=${ categoryName }`
    if (elementType)
      path += `&elementType=${ elementType }`
    if (markName)
      path += `&markName=${ markName }`
    if (tagNames)
      path += `&tagNames=${ tagNames.join(",") }`
    if (pagination)
      path += `&pagination=(${ pagination.join(",") })`

    return request(path)
  }

export const saveContentInCategory = async (categoryName: string, content: GalleryAPI.Content): Promise<void> =>
  request(`${ base }/saveContentInCategory?name=${ categoryName }`, {
    method: "post",
    data: content
  })


// Dashboard

export const getAllDashboardsName = async (): Promise<GalleryAPI.Dashboard[]> =>
  request(`${ base }/getAllDashboardsName`)

export const getAllDashboardsTemplate = async (): Promise<GalleryAPI.Dashboard[]> =>
  request(`${ base }/getAllDashboardsTemplate`)

export const getDashboardCategoryMarksAndTemplateByName =
  async (dashboardName: string): Promise<GalleryAPI.Dashboard> =>
    request(`${ base }/getDashboardCategoryMarksAndTemplateByName?dashboardName=${ dashboardName }`)

export const modifyDashboardDescription = async (dashboard: GalleryAPI.Dashboard): Promise<void> =>
  request(`${ base }/modifyDashboardDescription`, {
    method: "post",
    data: dashboard
  })

export const newDashboardAttachToEmptyCategory =
  async (categoryName: string, dashboard: GalleryAPI.Dashboard): Promise<void> =>
    request(`${ base }/newDashboardAttachToEmptyCategory?categoryName=${ categoryName }`, {
      method: "post",
      data: dashboard
    })


// Template

export const getTemplateElements =
  async (dashboardName: string, templateName: string): Promise<GalleryAPI.Template> =>
    request(`${ base }/getTemplateElements?dashboardName=${ dashboardName }&templateName=${ templateName }`)

export const saveTemplateInDashboard =
  async (dashboardName: string, template: GalleryAPI.Template): Promise<void> =>
    request(`${ base }/saveTemplateInDashboard?dashboardName=${ dashboardName }`, {
      method: "post",
      data: template
    })

export const deleteTemplateInDashboard =
  async (dashboardName: string, templateName: string): Promise<void> =>
    request(`${ base }/deleteTemplateInDashboard?dashboardName=${ dashboardName }&templateName=${ templateName }`, {
      method: "delete"
    })

export const copyTemplateElements = async (copyTE: GalleryAPI.CopyTemplateElements): Promise<void> =>
  request(`${ base }/copyTemplateElements`, {
    method: "post",
    data: copyTE
  })

export const updateTemplateElements = async (template: GalleryAPI.Template): Promise<void> =>
  request(`${ base }/updateTemplateElements`, {
    method: "post",
    data: template
  })


// Element

export const getElementContentDates = async (id: string, markName?: string): Promise<GalleryAPI.Element> => {
  let path = `${ base }/getElementContentDates?id=${ id }`
  if (markName)
    path += `&markName=${ markName }`

  return request(path)
}

export const getElementContent = async (id: string, date?: string, markName?: string): Promise<GalleryAPI.Element> => {
  let path = `${ base }/getElementContent?id=${ id }`
  if (date)
    path += `&date=${ date }`
  if (markName)
    path += `&markName=${ markName }`

  return request(path)
}

