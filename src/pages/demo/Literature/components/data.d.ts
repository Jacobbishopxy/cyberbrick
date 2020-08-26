/**
 * Created by Jacob Xie on 8/17/2020.
 */

export interface ControllerProps {
  categoryNames: string[]
  onSelect: (value: string) => void
}

export interface TagsViewProps {
  category?: API.Category
  tags: API.Tag[]
  tagsExcluded?: API.Tag[]
  editable: boolean
  isTagPanel?: boolean
  tagOnCreate?: (values: API.Tag) => void
  tagOnRemove?: (values: string) => void
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
  tagsExcluded: API.Tag[]
  visible: boolean
  onOk: () => void
  onCancel: () => void
  selectNames: (values: string[]) => void
}

export interface ArticlesViewProps {
  categoryName: string
  articles: API.Article[]
  unionTags: API.Tag[]
  editable: boolean
  articleOnCreate?: (value: API.Article) => void
  articleOnDelete?: (value: number) => void
}

export interface SingleArticleViewProps {
  unionTags: API.Tag[]
  article: API.Article
  editable: boolean
  articleOnModify?: (value: API.Article) => void
  articleOnDelete?: (value: number) => void
}

export interface NewArticleFormProps {
  categoryName: string
  tags: API.Tag[]
  onSubmit: (value: API.Article) => void
}

export interface TagsSelectorProps {
  tags: API.Tag[]
  onChange: (value: string[]) => void
  onAddNewTagInputChange: (value: string) => void
  onAddNewTag: () => void
}


export interface ContentProps {
  category: API.Category
  articles: API.Article[]
  tagPanelUpdate: (value: API.Tag) => void
  tagPanelDelete: (value: string) => void
  articlePanelUpdate: (value: API.Article) => void
  articlePanelDelete: (value: number) => void
}

export interface Editable {
  article: boolean
  tag: boolean
}

