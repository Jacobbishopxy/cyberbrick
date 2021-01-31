/**
 * Created by Jacob Xie on 12/17/2020
 */

import React from "react"

export interface GenericDataInput {
  id?: string
  index?: number
  name: string
  description?: string
  color?: string
}

export interface SelectableTagsProps {
  tags: GenericDataInput[]
  onSelectTags: (value: string[]) => void
}

export interface SelectableTagsRef {
  clearSelected: () => void
}

export interface EditableTagPanelProps<T extends GenericDataInput> {
  name?: string
  textCreation?: string | React.ReactNode
  textModification?: string | React.ReactNode
  textDeletion?: string | React.ReactNode
  colorSelector?: boolean

  data: T[]
  editable: boolean
  elementOnChange: (data: T[]) => void
}

export interface SearchableTagsProps<T extends GenericDataInput> {
  searchable: boolean
  data: T[]
  elementOnSearch: (value: string[]) => void
}

export interface DraggableTagPanelProps<T extends GenericDataInput> {
  editable: boolean
  data: T[]
  elementOnChange: (data: T[]) => void
}

