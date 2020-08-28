/**
 * Created by Jacob Xie on 8/28/2020.
 */

export interface TagSelectModalProps {
  tagsExcluded: API.Tag[]
  visible: boolean
  onOk: () => void
  onCancel: () => void
  selectNames: (values: string[]) => void
}

export interface SingleArticleTagProps {
  tags: API.Tag[]
  tagsExcluded?: API.Tag[]
  editable?: boolean
  tagsOnChange?: (values: API.Tag[]) => void
}

export interface TagsSelectorProps {
  tags: API.Tag[]
  onChange: (value: string[]) => void
  onAddNewTagInputChange: (value: string) => void
  onAddNewTag: () => void
}

export interface NewArticleFormProps {
  categoryName: string
  tags: API.Tag[]
  onSubmit: (value: API.Article) => void
}


export interface SingleArticleProps {
  unionTags: API.Tag[]
  article: API.Article
  editable: boolean
  articleOnModify: (value: API.Article) => void
  articleOnDelete: (value: number) => void
}


export interface ArticlePanelProps {
  categoryName: string
  articles: API.Article[]
  unionTags: API.Tag[]
  editable: boolean
  articleOnCreate: (value: API.Article) => void
  articleOnDelete: (value: number) => void
}
