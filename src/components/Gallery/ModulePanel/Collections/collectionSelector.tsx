/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'

import * as DataType from "../../GalleryDataType"
import { ConvertRefFR } from "../Generator/data"
import {
  EmbedLink,
  Text,
  EditableTable,
} from "./index"

import styles from "../Panel/Common.less"


export interface ModuleSelectorProps {
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  forwardedRef: React.Ref<ConvertRefFR>
}

export const collectionSelector = (moduleType: DataType.ElementType): React.FC<ModuleSelectorProps> =>
  (props: ModuleSelectorProps) => {

    const defaultModule = <EmbedLink
      content={ props.content }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const textModule = <Text
      content={ props.content }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const editableTable = <EditableTable
      content={ props.content }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    switch (moduleType) {
      case DataType.ElementType.EmbedLink:
        return defaultModule
      case DataType.ElementType.Text:
        return textModule
      case DataType.ElementType.EditableTable:
        return editableTable
      default:
        return defaultModule
    }
  }

