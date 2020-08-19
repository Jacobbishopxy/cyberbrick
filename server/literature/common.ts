/**
 * Created by Jacob Xie on 8/19/2020.
 */

export type QueryStr = string | undefined

export const article = "article"
export const category = "category"
export const author = "author"
export const tag = "tag"


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
