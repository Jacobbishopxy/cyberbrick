/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'

import * as DataType from "../../GalleryDataType"
import { ConvertFwRef } from "../Generator/data"
import {
  EmbedLink,
  Text,
  XlsxTable,
} from "./index"

import styles from "../Panel/Common.less"


export interface ModuleSelectorProps {
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  forwardedRef: React.Ref<ConvertFwRef>
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

    const xlsxTable = <XlsxTable
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
      case DataType.ElementType.XlsxTable:
        return xlsxTable
      default:
        return defaultModule
    }
  }

