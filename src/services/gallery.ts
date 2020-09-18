/**
 * Created by Jacob Xie on 9/18/2020.
 */

import request from "umi-request"


const base = "/api/gallery"


// Category

export const getAllCategoriesName = async (): Promise<string[]> =>
  request(`${ base }/getAllCategoriesName`)

export const getAllCategoriesWithoutContents = async (): Promise<GalleryAPI.Category> =>
  request(`${ base }/getAllCategoriesWithoutContents`)

export const getCategoryMarkAndTagByName = async (name: string): Promise<GalleryAPI.Category> =>
  request(`${ base }/getCategoryMarkAndTagByName?name=${ name }`)

export const getCategoryContentByName = async (name: string): Promise<GalleryAPI.Category> =>
  request(`${ base }/getCategoryContentByName?name=${ name }`)

export const saveCategoryMark = async (categoryName: string, mark: GalleryAPI.Mark) =>
  request(`${ base }/saveCategoryMark?name=${ categoryName }`, {
    method: "post",
    data: mark
  })

export const saveCategoryTag = async (categoryName: string, tag: GalleryAPI.Tag) =>
  request(`${ base }/saveCategoryTag?name=${ categoryName }`, {
    method: "post",
    data: tag
  })


// Mark

export const getCategoriesByMarkName = async (name: string) =>
  request(`${ base }/getCategoriesByMarkName?name=${ name }`)

export const deleteMarkInCategory = async (categoryName: string, markName: string) =>
  request(`${ base }/deleteMarkInCategory?categoryName=${ categoryName }&markName=${ markName }`, {
    method: "delete"
  })


// Tag

export const getCategoriesByTagName = async (name: string) =>
  request(`${ base }/getCategoriesByTagName?name=${ name }`)

export const deleteTagInCategory = async (categoryName: string, tagName: string) =>
  request(`${ base }/deleteTagInCategory?categoryName=${ categoryName }&tagName=${ tagName }`, {
    method: "delete"
  })


// Content

export const getContentsInCategoryByMarkAndTags =
  async (categoryName: string,
         markName?: string,
         tagNames?: string[],
         pagination?: [number, number]): Promise<GalleryAPI.Content> => {
    let path = `${ base }/getContentsInCategoryByMarkAndTags?categoryName=${ categoryName }`
    if (markName)
      path += `&markName=${ markName }`
    if (tagNames)
      path += `&tagNames=${ tagNames.join(",") }`
    if (pagination)
      path += `&pagination=(${ pagination.join(",") })`

    return request(path)
  }

export const saveContentInCategory = async (categoryName: string, content: GalleryAPI.Content) =>
  request(`${ base }/saveContentInCategory?name=${ categoryName }`, {
    method: "post",
    data: content
  })


// Dashboard

export const getAllDashboardsName = async () =>
  request(`${ base }/getAllDashboardsName`)

export const getDashboardTemplateElementsByName = async (dashboardName: string, templateName: string) =>
  request(`getDashboardTemplateElementsByName?dashboardName=${ dashboardName }&templateName=${ templateName }`)

export const newDashboardAttachToEmptyCategory = async (categoryName: string, dashboard: GalleryAPI.Dashboard) =>
  request(`newDashboardAttachToEmptyCategory?categoryName=${ categoryName }`, {
    method: "post",
    data: dashboard
  })


// Template

export const getTemplateElementsContents = async (dashboardName: string, templateName: string) =>
  request(`${ base }/getTemplateElementsContents?dashboardName=${ dashboardName }&templateName=${ templateName }`)

export const getTemplateElements = async (dashboardName: string, templateName: string) =>
  request(`${ base }/getTemplateElements?dashboardName=${ dashboardName }&templateName=${ templateName }`)

export const copyTemplateElements = async (copyTE: GalleryAPI.CopyTemplateElements) =>
  request(`${ base }/copyTemplateElements`, {
    method: "post",
    data: copyTE
  })

export const updateTemplateElements = async (template: GalleryAPI.Template) =>
  request(`${ base }/updateTemplateElements`, {
    method: "post",
    data: template
  })


// Element

export const getElementLatestContent = async (id: string, markName?: string) => {
  let path = `${ base }/getElementLatestContent?id=${ id }`
  if (markName)
    path += `&markName=${ markName }`

  return request(path)
}

