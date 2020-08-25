declare namespace API {
  export interface CurrentUser {
    avatar?: string
    name?: string
    title?: string
    group?: string
    signature?: string
    tags?: {
      key: string
      label: string
    }[]
    userid?: string
    access?: 'user' | 'guest' | 'admin'
    unreadCount?: number
  }

  export interface LoginStateType {
    status?: 'ok' | 'error'
    type?: string
  }

  export interface NoticeIconData {
    id: string
    key: string
    avatar: string
    title: string
    datetime: string
    type: string
    read?: boolean
    description: string
    clickClose?: boolean
    extra: any
    status: string
  }

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
    tag: Tag
  }
}
