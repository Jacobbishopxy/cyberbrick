/**
 * Created by Jacob Xie on 8/17/2020.
 */



export interface TagsViewProps {
  category?: API.Category
  tags: API.Tag[]
  tagsExcluded?: API.Tag[]
  editable: boolean
  isTagPanel?: boolean
  tagOnCreate?: (values: API.Tag) => void
  tagOnRemove?: (values: string) => void
  tagsOnChange?: (values: API.Tag[]) => void
  onSelectTags?: (value: string[]) => void
}

interface CreationModalValue {
  name: string
  description?: string
}

export interface CreationModalProps {
  title: string
  visible: boolean
  onSubmit: (value: CreationModalValue) => void
  onCancel: () => void
}


export interface ContentProps {
  category: API.Category
  articles: API.Article[]
  tagPanelUpdate: (value: API.Tag) => void
  tagPanelDelete: (value: string) => void
  articlePanelUpdate: (value: API.Article) => void
  articlePanelDelete: (value: number) => void
  tagPanelSearch: (value: string[]) => void
}

export interface Editable {
  article: boolean
  tag: boolean
}

