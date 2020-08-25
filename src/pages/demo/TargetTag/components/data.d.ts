/**
 * Created by Jacob Xie on 8/17/2020.
 */

export interface TagsViewProps {
  tags: API.Tag[]
  tagsNameExclude?: string[]
  editable: boolean
  isTagPanel?: boolean
  tagOnCreate?: (values: API.Tag) => Promise<void>
  tagOnRemove?: (values: string) => Promise<void>
  tagsOnChange?: (values: API.Tag[]) => void
}

export interface TagCreateModalProps {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  inputName: (value: string) => void
  inputDescription: (value: string) => void
}

export interface TagSelectModalProps {
  tagsNameExclude: string[]
  visible: boolean
  onOk: () => void
  onCancel: () => void
  selectNames: (values: string[]) => void
}

export interface ArticlesViewProps {
  articles: API.Article[]
  tags: API.Tag[]
  editable: boolean
  articleOnCreate?: (value: API.Article) => Promise<void>
  articleOnDelete?: (value: number) => Promise<void>
}

export interface SingleArticleViewProps {
  tagsName: string[]
  article: API.Article
  editable: boolean
  targetOnModify?: (value: API.Article) => Promise<void>
}

export interface NewArticleFormProps {
  tags: API.Tag[]
  onSubmit: (value: API.Article) => Promise<void>
}

export interface TagsSelectorProps {
  tags: API.Tag[]
  onChange: (value: string[]) => void
  onAddNewTagInputChange: (value: string) => void
  onAddNewTag: () => void
}
