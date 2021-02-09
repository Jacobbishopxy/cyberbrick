/**
 * Created by Jacob Xie on 2/5/2021
 */

import React from "react"


export interface GenericTag {
  id?: string
  name: string
  description?: string
  color?: string
}

export interface GenericArticle {
  id: string
  date: string
  title: string
  data: string
  tags: GenericTag[]
}

export interface CreationTriggerActions {
  onClick: () => void
}

export interface ArticleCreationModalProps {
  trigger: React.FC<CreationTriggerActions>
  tags?: GenericTag[]
  initialValue?: GenericArticle
  onSubmit: (value: GenericArticle) => void
  modalWidth?: string | number
  modalHeight?: string | number
}

export interface TagCreationModalProps {
  trigger: React.FC<CreationTriggerActions>
  onSubmit: (value: GenericTag) => void
  modalWidth?: string | number
  modalHeight?: string | number
}

export interface TagModificationModalProps {
  trigger: React.FC<CreationTriggerActions>
  tags: GenericTag[]
  onSubmit: (v: any) => void
  modalWidth?: string | number
  modalHeight?: string | number
}

interface ArticleToolbarProps {
  tags: GenericTag[]
  editable: boolean
  onEdit: (v: boolean) => void
  articleCreationOnSubmit: (v: any) => void
  tagModificationModal: (v: any) => void
}

export interface ArticleProps {
  getArticles: (pagination?: [number, number]) => Promise<GenericArticle[]>
  getTags: () => Promise<GenericTag[]>
  modifyArticle: (value: GenericArticle) => Promise<any>
  modifyTags: (value: GenericTag[]) => Promise<any>
  defaultPageSize?: number
  title?: string
}

