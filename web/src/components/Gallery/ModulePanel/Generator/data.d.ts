/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from "react"

import * as DataType from "../../GalleryDataType"

export interface ModuleEditorField {
  content?: DataType.Content
  contentHeight?: number
  updateContent: (c: DataType.Content) => void
  styling?: string
}

export interface ModulePresenterField {
  content?: DataType.Content
  fetchRemote?: (c: DataType.Content) => Promise<any>
  contentHeight?: number
  styling?: string
}

export interface ConvertFwRef {
  edit: (value: boolean) => void
}

export interface ConvertRefProps {
  content?: DataType.Content
  fetchRemote?: (c: DataType.Content) => Promise<any>
  contentHeight?: number
  updateContent: (c: DataType.Content) => void
  styling?: string
  forwardedRef: React.Ref<ConvertFwRef>
}

export interface ConvertProps {
  content?: DataType.Content
  fetchRemote?: (c: DataType.Content) => Promise<any>
  contentHeight?: number
  updateContent: (c: DataType.Content) => void
  styling?: string
}

