/**
 * Created by Jacob Xie on 8/16/2020.
 */

import request from "umi-request"


const base = "/api/literature"


// Category

export const getAllCategoriesWithUnionTags = async (): Promise<API.Category[]> =>
  request(`${ base }/categories`)

export const getCategoriesByNames = async (names: string[]): Promise<API.Category[]> =>
  request(`${ base }/category?name=${ names.join(",") }`)

export const saveCategory = async (d: API.Category): Promise<API.Category> =>
  request(`${ base }/category`, {
    method: "post",
    data: d
  })

export const deleteCategory = async (name: string) =>
  request(`${ base }/category?name=${ name }`, {
    method: "delete"
  })

export const getTagsByCategoryName = async (name: string): Promise<API.Category> =>
  request(`${ base }/getTagsByCategoryName?name=${ name }`)

export const upsertCategoryTag = async (d: API.CategoryU) =>
  request(`${ base }/upsertCategoryTag`, {
    method: "post",
    data: d
  })

export const removeCategoryTag = async (categoryName: string, tagName: string) =>
  request(`${ base }/removeCategoryTag?categoryName=${ categoryName }&tagName=${ tagName }`, {
    method: "delete"
  })


// Article

export const getAllArticles = async (): Promise<API.Article[]> =>
  request(`${ base }/articles`)

export const getArticlesByIds = async (ids: number[]): Promise<API.Article[]> =>
  request(`${ base }/article?ids=${ ids.join(",") }`)

export const saveArticle = async (d: API.Article): Promise<API.Article> =>
  request(`${ base }/article`, {
    method: "POST",
    data: d
  })

export const deleteArticle = async (id: number) =>
  request(`${ base }/article?id=${ id }`, {
    method: "delete"
  })

export const getArticlesByCategoryNameAndTagNames =
  async (categoryName: string, tagNames?: string[], pagination?: [number, number]): Promise<API.Article[]> => {
    let path = `${ base }/getArticlesByCategoryNameAndTagNames?categoryName=${ categoryName }`
    if (tagNames)
      path += `&tagNames=${ tagNames.join(",") }`
    if (pagination)
      path += `&pagination=(${ pagination.join(",") })`

    return request(path)
  }

export const getArticlesByAuthorName =
  async (author: string, pagination?: [number, number]): Promise<API.Article[]> => {
    let path = `${ base }/getArticlesByAuthorName?name=${ author }`
    if (pagination)
      path += `&pagination=(${ pagination.join(",") })`

    return request(path)
  }


// Tag

export const getAllTags = async (): Promise<API.Tag[]> =>
  request(`${ base }/tags`)

export const getTagsByNames = async (names: string[]): Promise<API.Tag[]> =>
  request(`${ base }/tag?names=${ names.join(",") }`)

export const saveTag = async (d: API.Tag): Promise<API.Tag> =>
  request(`${ base }/tag`, {
    method: "post",
    data: d
  })

export const deleteTag = async (name: string) =>
  request(`${ base }/tag?name=${ name }`, {
    method: "delete"
  })

export const getCommonCategoriesByTagNames = async (names: string[]): Promise<string[]> =>
  request(`${ base }/getCommonCategoriesByTagNames?${ names.join(",") }`)


// Author

export const getAllAuthors = async (): Promise<API.Author[]> =>
  request(`${ base }/authors`)

export const getAuthorsByNames = async (names: string[]): Promise<API.Author[]> =>
  request(`${ base }/author?names=${ names.join(",") }`)

export const saveAuthor = async (d: API.Author): Promise<API.Author> =>
  request(`${ base }/author`, {
    method: "post",
    data: d
  })

export const deleteAuthor = async (name: string) =>
  request(`${ base }/author?name=${ name }`, {
    method: "delete"
  })

