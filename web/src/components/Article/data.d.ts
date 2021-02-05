/**
 * Created by Jacob Xie on 2/5/2021
 */

import React from "react"


export interface GenericTag {
  id: string
  name: string
  description?: string
  color?: string
}

export interface ArticleOutput {
  value: string
  tagIds?: string[]
}

export interface CreationTriggerActions {
  onClick: () => void
}

export interface ArticleCreationModalProps {
  trigger: React.FC<CreationTriggerActions>
  tags?: GenericTag[]
  onSubmit: (value: ArticleOutput) => void
  modalWidth?: string | number
  modalHeight?: string | number
}

export interface TagCreationModalProps {
  trigger: React.FC<CreationTriggerActions>
  onSubmit: (value: GenericTag) => void
  modalWidth?: string | number
  modalHeight?: string | number
}

