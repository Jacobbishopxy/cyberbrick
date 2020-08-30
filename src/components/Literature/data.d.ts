/**
 * Created by Jacob Xie on 8/17/2020.
 */

export interface Article {
  id?: string
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

export interface TagU {
  name: string
  description?: string
  category: Category
}


