/**
 * Created by Jacob Xie on 8/19/2020.
 */

export type QueryStr = string | undefined

// db name
export const article = "article"
export const category = "category"
export const author = "author"
export const tag = "tag"

// column name
export const tags = "tags"
export const name = "name"
export const articles = "articles"
export const date = "date"
export const id = "id"

// joint column name
export const articleId = `${article}.${id}`
export const articleCategory = `${article}.${category}`
export const articleAuthor = `${article}.${author}`
export const articleTags = `${article}.${tags}`
export const categoryName = `${category}.${name}`
export const categoryArticles = `${category}.${articles}`
export const tagName = `${tag}.${name}`
export const articlesAuthor = `${articles}.${author}`
export const articlesTags = `${articles}.${tags}`


const regSkip = new RegExp("^\\((\\d+),")
const regTake = new RegExp(",(\\d+)\\)$")

export const paginationSkip = (pagination: string) => {
  const s = regSkip.exec(pagination)
  if (s === null)
    return undefined
  return +s[1]
}

export const paginationTake = (pagination: string) => {
  const t = regTake.exec(pagination)
  if (t === null)
    return undefined
  return +t[1]
}
