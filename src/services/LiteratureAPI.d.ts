/**
 * Created by Jacob Xie on 9/18/2020.
 */

declare namespace LiteratureAPI {
  export interface Article {
    id?: number
    category: Category
    tags?: Tag[]
    date: string
    author: Author
    title: string
    text: string
    version: number
  }

  export interface Tag {
    name: string
    description?: string
    articles?: TargetType[]
    categories?: Category[]
  }

  export interface Category {
    name: string
    description?: string
    articles?: Article[]
    unionTags?: Tag[]
  }

  export interface Author {
    name: string
    description?: string
    articles?: Article[]
  }

  export interface CategoryU {
    name: string
    description?: string
    tag?: Tag
  }
}

