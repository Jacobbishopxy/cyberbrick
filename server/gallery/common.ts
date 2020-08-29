/**
 * Created by Jacob Xie on 8/29/2020.
 */


export type QueryStr = string | undefined

// table name
export const dashboard = "dashboard"
export const template = "template"
export const element = "element"
export const content = "content"

// column name
const name = "name"
const symbol = "symbol"
const date = "date"
const text = "text"
const title = "title"

// joint column name

export const dateType = process.env.NODE_ENV === 'production' ? "timestamp" : "datetime"
