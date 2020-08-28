/**
 * Created by Jacob Xie on 8/28/2020.
 */

import { Tag, Article } from "../data"

export interface TagSelectModalProps {
  tagsExcluded: Tag[]
  visible: boolean
  onOk: () => void
  onCancel: () => void
  selectNames: (values: string[]) => void
}

export interface SingleArticleTagProps {
  tags: Tag[]
  tagsExcluded?: Tag[]
  editable?: boolean
  tagsOnChange?: (values: Tag[]) => void
}

export interface TagsSelectorProps {
  tags: Tag[]
  onChange: (value: string[]) => void
  onAddNewTagInputChange: (value: string) => void
  onAddNewTag: () => void
}

export interface NewArticleFormProps {
  categoryName: string
  tags: Tag[]
  onSubmit: (value: Article) => void
}


export interface SingleArticleProps {
  unionTags: Tag[]
  article: Article
  editable: boolean
  articleOnModify: (value: Article) => void
  articleOnDelete: (value: number) => void
}


export interface ArticlePanelProps {
  categoryName: string
  articles: Article[]
  unionTags: Tag[]
  editable: boolean
  articleOnCreate: (value: Article) => void
  articleOnDelete: (value: number) => void
}
