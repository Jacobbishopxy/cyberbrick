/**
 * Created by Jacob Xie on 8/29/2020.
 */


// table name
export const dashboard = "dashboard"
export const template = "template"
export const element = "element"
export const content = "content"

// column name
export const name = "name"
export const symbol = "symbol"
export const date = "date"
export const text = "text"
export const title = "title"
export const contents = "contents"
export const elements = "elements"
export const templates = "templates"

// joint column name
export const elementsContents = `${ elements }.${ contents }`
export const templatesElements = `${ templates }.${ elements }`
export const templatesElementsContents = `${ templates }.${ elements }.${ contents }`


export const dateType = process.env.NODE_ENV === 'production' ? "timestamp" : "datetime"


