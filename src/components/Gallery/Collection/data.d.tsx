/**
 * Created by Jacob Xie on 8/4/2020.
 */

import React from 'react';

import * as dashboardModel from '@/utilities/dashboardModel';


type ContentType = dashboardModel.Content

export interface ContentGeneratorProps {
  InputField: React.FC<ModuleInputField>
  DisplayField: React.FC<ModuleDisplayField>
}

export interface ConvertRefFR {
  edit: () => void
}

export interface ConvertRefProps {
  content: ContentType | null
  updateContent: (a: ContentType) => void
  styling?: string
  forwardedRef: React.Ref<ConvertRefFR>
}

export interface ConvertProps {
  content: ContentType | null
  updateContent: (a: ContentType) => void
  styling?: string
}

export interface ModuleInputField {
  content: ContentType
  updateContent: (a: ContentType) => void
  styling?: string
}

export interface ModuleDisplayField {
  content: ContentType
  styling?: string
}

