/**
 * Created by Jacob Xie on 8/28/2020.
 */

export interface TagPanelProps {
  category: API.Category
  tags: API.Tag[]
  editable: boolean
  tagOnCreate: (value: API.Tag) => void
  tagOnRemove: (value: string) => void
  tagOnSelect: (value: string[]) => void
}

export interface SelectableTagsProps {
  tags: API.Tag[]
  onSelectTags: (value: string[]) => void
}
