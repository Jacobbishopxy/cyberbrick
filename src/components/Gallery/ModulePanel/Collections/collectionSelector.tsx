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
  TargetPrice,
  Line
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

    const text = <Text
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

    const targetPrice = <TargetPrice
      content={ props.content }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const line = <Line
      content={ props.content }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    switch (moduleType) {
      case DataType.ElementType.EmbedLink:
        return defaultModule
      case DataType.ElementType.Text:
        return text
      case DataType.ElementType.XlsxTable:
        return xlsxTable
      case DataType.ElementType.TargetPrice:
        return targetPrice
      case DataType.ElementType.Line:
        return line
      default:
        return defaultModule
    }
  }

