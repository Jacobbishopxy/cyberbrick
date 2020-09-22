/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from "react"

import * as DataType from "../../DataType"

export interface ModuleEditorField {
  content: DataType.Content
  updateContent: (c: DataType.Content) => void
  styling?: string
}

export interface ModulePresenterField {
  content: DataType.Content
  styling?: string
}

export interface ModuleGeneratorProps {
  EditorField: React.FC<ModuleEditorField>
  PresenterField: React.FC<ModulePresenterField>
}

export interface ConvertRefFR {
  edit: () => void
}

export interface ConvertRefProps {
  content: DataType.Content
  updateContent: (c: DataType.Content) => void
  styling?: string
  forwardedRef: React.Ref<ConvertRefFR>
}

export interface ConvertProps {
  content: DataType.Content
  updateContent: (c: DataType.Content) => void
  styling?: string
}

