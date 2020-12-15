/**
 * Created by Jacob Xie on 9/18/2020.
 */

import {request} from "umi"


const base = "/api/gallery"
const baseDb = "/api/database"


// Category

export const getAllCategoriesName = async (): Promise<string[]> =>
  request(`${base}/getAllCategoriesName`)

export const getAllCategoriesWithoutContents = async (): Promise<GalleryAPI.Category[]> =>
  request(`${base}/getAllCategoriesWithoutContents`)

export const getCategoryMarkAndTagByName = async (name: string): Promise<GalleryAPI.Category> =>
  request(`${base}/getCategoryMarkAndTagByName?name=${name}`)

export const getCategoryContentByName = async (name: string): Promise<GalleryAPI.Category> =>
  request(`${base}/getCategoryContentByName?name=${name}`)

export const saveCategory = async (category: GalleryAPI.Category): Promise<void> =>
  request(`${base}/saveCategory`, {
    method: "post",
    data: category
  })

export const saveCategoryMark = async (categoryName: string, mark: GalleryAPI.Mark): Promise<void> =>
  request(`${base}/saveCategoryMark?name=${categoryName}`, {
    method: "post",
    data: mark
  })

export const saveCategoryTag = async (categoryName: string, tag: GalleryAPI.Tag): Promise<void> =>
  request(`${base}/saveCategoryTag?name=${categoryName}`, {
    method: "post",
    data: tag
  })


// Mark

export const getCategoriesByMarkName = async (name: string): Promise<GalleryAPI.Category[]> =>
  request(`${base}/getCategoriesByMarkName?name=${name}`)

export const modifyMark = async (mark: GalleryAPI.Mark) =>
  request(`${base}/modifyMark`, {
    method: "post",
    data: mark
  })

export const deleteMarkInCategory = async (categoryName: string, markName: string): Promise<void> =>
  request(`${base}/deleteMarkInCategory?categoryName=${categoryName}&markName=${markName}`, {
    method: "delete"
  })


// Tag

export const getCategoriesByTagName = async (name: string): Promise<GalleryAPI.Category[]> =>
  request(`${base}/getCategoriesByTagName?name=${name}`)

export const modifyTag = async (tag: GalleryAPI.Tag) =>
  request(`${base}/modifyTag`, {
    method: "post",
    data: tag
  })

export const deleteTagInCategory = async (categoryName: string, tagName: string): Promise<void> =>
  request(`${base}/deleteTagInCategory?categoryName=${categoryName}&tagName=${tagName}`, {
    method: "delete"
  })


// Content

export const getContentsInCategoryByElementTypeAndMarkAndTags =
  async (categoryName: string,
         elementType?: string,
         markName?: string,
         tagNames?: string[],
         pagination?: [number, number]): Promise<GalleryAPI.Content> => {
    let path = `${base}/getContentsInCategoryByElementTypeAndMarkAndTags?categoryName=${categoryName}`
    if (elementType)
      path += `&elementType=${elementType}`
    if (markName)
      path += `&markName=${markName}`
    if (tagNames)
      path += `&tagNames=${tagNames.join(",")}`
    if (pagination)
      path += `&pagination=(${pagination.join(",")})`

    return request(path)
  }

export const saveContentInCategory = async (categoryName: string, content: GalleryAPI.Content): Promise<void> =>
  request(`${base}/saveContentInCategory?name=${categoryName}`, {
    method: "post",
    data: content
  })


// Dashboard

export const getAllDashboardsName = async (): Promise<GalleryAPI.Dashboard[]> =>
  request(`${base}/getAllDashboardsName`)

export const getAllDashboardsTemplate = async (): Promise<GalleryAPI.Dashboard[]> =>
  request(`${base}/getAllDashboardsTemplate`)

export const getDashboardCategoryMarksAndTemplate =
  async (id: string): Promise<GalleryAPI.Dashboard> =>
    request(`${base}/getDashboardCategoryMarksAndTemplate?id=${id}`)

export const modifyDashboard = async (dashboard: GalleryAPI.Dashboard): Promise<void> =>
  request(`${base}/modifyDashboard`, {
    method: "post",
    data: dashboard
  })

export const newDashboardAttachToCategory =
  async (categoryName: string, dashboard: GalleryAPI.Dashboard): Promise<void> =>
    request(`${base}/newDashboardAttachToCategory?categoryName=${categoryName}`, {
      method: "post",
      data: dashboard
    })

export const deleteDashboardInCategory = async (categoryName: string, dashboardName: string): Promise<void> =>
  request(`${base}/deleteDashboardInCategory?categoryName=${categoryName}&dashboardName=${dashboardName}`, {
    method: "delete"
  })


// Template

export const getTemplateElements =
  async (templateId: string): Promise<GalleryAPI.Template> =>
    request(`${base}/getTemplateElements?id=${templateId}`)

export const saveTemplateInDashboard =
  async (id: string, template: GalleryAPI.Template): Promise<void> =>
    request(`${base}/saveTemplateInDashboard?id=${id}`, {
      method: "post",
      data: template
    })

export const deleteTemplate =
  async (templateId: string): Promise<void> =>
    request(`${base}/template?id=${templateId}`, {
      method: "delete"
    })

export const copyTemplateElements = async (copyTE: GalleryAPI.CopyTemplateElements): Promise<void> =>
  request(`${base}/copyTemplateElements`, {
    method: "post",
    data: copyTE
  })

export const updateTemplateElements = async (template: GalleryAPI.Template): Promise<void> =>
  request(`${base}/updateTemplateElements`, {
    method: "post",
    data: template
  })


// Element

export const getElementContentDates = async (id: string, markName?: string): Promise<GalleryAPI.Element> => {
  let path = `${base}/getElementContentDates?id=${id}`
  if (markName)
    path += `&markName=${markName}`

  return request(path)
}

export const getElementContent = async (id: string, date?: string, markName?: string): Promise<GalleryAPI.Element> => {
  let path = `${base}/getElementContent?id=${id}`
  if (date)
    path += `&date=${date}`
  if (markName)
    path += `&markName=${markName}`

  return request(path)
}


// Storage
// web server API

export const getAllStorages = async (): Promise<GalleryAPI.Storage[]> =>
  request(`${base}/storages`)

export const getStorageById = async (id: string): Promise<GalleryAPI.Storage> =>
  request(`${base}/storage?id=${id}`)

export const saveStorage = async (storage: GalleryAPI.Storage) =>
  request(`${base}/storage`, {
    method: "post",
    data: storage
  })

export const deleteStorage = async (id: string) =>
  request(`${base}/storage?id=${id}`, {
    method: "delete"
  })

export const getAllStorageSimple = async (): Promise<GalleryAPI.StorageSimple[]> =>
  request(`${base}/getAllStorageSimple`)

export const testConnection = async (id: string): Promise<boolean> =>
  request(`${base}/testConnection?id=${id}`)

export const reloadConnection = async (id: string): Promise<string> =>
  request(`${base}/reloadConnection?id=${id}`)

export const executeSql = async (id: string, sqlString: string) =>
  request(`${base}/executeSql?id=${id}&sqlString=${sqlString}`)

export const read = async (id: string, readOption: GalleryAPI.Read) =>
  request(`${base}/read?id=${id}`, {
    method: "post",
    data: readOption
  })

// Storage
// server API (redirect)

export const databaseListTable = async (id: string): Promise<string[]> =>
  request(`${baseDb}/listTable?id=${id}`)

export const databaseGetTableColumns = async (id: string, tableName: string): Promise<string[]> =>
  request(`${baseDb}/getTableColumns?id=${id}&tableName=${tableName}`)

export const databaseDropTable = async (id: string, tableName: string) =>
  request(`${baseDb}/dropTable?id=${id}&tableName=${tableName}`, {
    method: "delete"
  })

export const databaseRenameTable = async (id: string, data: any) => {
  const path = `${baseDb}/renameTable?id=${id}`
  return request(path, {
    method: "post",
    data
  })
}

export const databaseInsert = async (id: string, insertOption: string, tableName: string, data: any) => {
  let path = `${baseDb}/insert?id=${id}&tableName=${tableName}`
  if (insertOption) path += `&insertOption=${insertOption}`
  return request(path, {
    method: "post",
    data
  })
}

export const databaseUpdate = async (id: string, tableName: string, itemId: string, data: any) => {
  const path = `${baseDb}/update?id=${id}&tableName=${tableName}&itemId=${itemId}`
  return request(path, {
    method: "post",
    data
  })
}

export const databaseDelete = async (id: string, tableName: string, itemId: string) => {
  const path = `${baseDb}/delete?id=${id}&tableName=${tableName}&itemId=${itemId}`
  return request(path, {
    method: "delete",
  })
}

