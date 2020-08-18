import { Tag, Target } from "@/services/targetTag"

/**
 * Created by Jacob Xie on 8/17/2020.
 */

export interface TagsViewProps {
  tags: Tag[]
  tagsNameExclude?: string[]
  editable: boolean
  isTagPanel?: boolean
  tagOnCreate?: (values: Tag) => Promise<void>
  tagOnRemove?: (values: string) => Promise<void>
  tagsOnChange?: (values: Tag[]) => void
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

export interface TargetsViewProps {
  targets: Target[]
  tags: Tag[]
  editable: boolean
  targetOnCreate?: (value: Target) => Promise<void>
  targetOnDelete?: (value: number) => Promise<void>
}

export interface SingleTargetViewProps {
  tagsName: string[]
  target: Target
  editable: boolean
  targetOnModify?: (value: Target) => Promise<void>
}

export interface NewTargetFormProps {
  tags: Tag[]
  onSubmit: (value: Target) => Promise<void>
}

export interface TagsSelectorProps {
  tags: Tag[]
  onChange: (value: string[]) => void
  onAddNewTagInputChange: (value: string) => void
  onAddNewTag: () => void
}
