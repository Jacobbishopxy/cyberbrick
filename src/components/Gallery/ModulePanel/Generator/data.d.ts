/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from "react"

import * as DataType from "../../GalleryDataType"

export interface ModuleEditorField {
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  styling?: string
}

export interface ModulePresenterField {
  content?: DataType.Content
  styling?: string
}

export interface ConvertFwRef {
  edit: (value: boolean) => void
}

export interface ConvertRefProps {
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  styling?: string
  forwardedRef: React.Ref<ConvertFwRef>
}

export interface ConvertProps {
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  styling?: string
}

