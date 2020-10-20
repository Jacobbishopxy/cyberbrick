/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'

import * as DataType from "../../GalleryDataType"
import { ConvertFwRef } from "../Generator/data"
import { XlsxTable } from "./table/XlsxTable"
import { EmbedLink } from "./miscellaneous/EmbedLink"
import { Text } from "./miscellaneous/Text"
import { TargetPrice } from "./miscellaneous/TargetPrice"
import { Line } from "./graph/Line"
import { Bar } from "./graph/Bar"
import { LineBar } from "./graph/LineBar"
import { Pie } from "./graph/Pie"

import styles from "../Panel/Common.less"


export interface ModuleSelectorProps {
  content?: DataType.Content
  contentHeight?: number
  updateContent: (c: DataType.Content) => void
  forwardedRef: React.Ref<ConvertFwRef>
}

export const collectionSelector = (moduleType: DataType.ElementType): React.FC<ModuleSelectorProps> =>
  (props: ModuleSelectorProps) => {

    const defaultModule = <EmbedLink
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const text = <Text
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const xlsxTable = <XlsxTable
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const targetPrice = <TargetPrice
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const line = <Line
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const bar = <Bar
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const lineBar = <LineBar
      content={ props.content }
      contentHeight={ props.contentHeight }
      updateContent={ props.updateContent }
      styling={ styles.contentPanel }
      ref={ props.forwardedRef }
    />

    const pie = <Pie
      content={ props.content }
      contentHeight={ props.contentHeight }
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
      case DataType.ElementType.Bar:
        return bar
      case DataType.ElementType.LineBar:
        return lineBar
      case DataType.ElementType.Pie:
        return pie
      default:
        return defaultModule
    }
  }

