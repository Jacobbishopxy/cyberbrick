/**
 * Created by Jacob Xie on 8/28/2020.
 */

import { Category, Tag } from "../data"

export interface TagPanelProps {
  category: Category
  tags: Tag[]
  editable: boolean
  tagOnCreate: (value: Tag) => void
  tagOnRemove: (value: string) => void
  tagOnSelect: (value: string[]) => void
}

export interface SelectableTagsProps {
  tags: Tag[]
  onSelectTags: (value: string[]) => void
}
