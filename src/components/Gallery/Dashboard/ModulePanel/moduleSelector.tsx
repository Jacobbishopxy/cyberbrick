/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'

import * as DataType from "../../DataType"
import { EmbedLink } from "../ModuleCollection/Collections/EmbedLink"
import { Text } from "../ModuleCollection/Collections/Text"
import { ConvertRefFR } from "../ModuleCollection/data"

import styles from "./Common.less"


export const moduleList = [
  {
    key: 'misc',
    name: '功能',
    children: [
      {
        key: DataType.ElementType.EmbedLink,
        name: '链接',
        disabled: false,
      },
      {
        key: DataType.ElementType.Text,
        name: '文字',
        disabled: false,
      },
      {
        key: DataType.ElementType.TargetPrice,
        name: '目标价',
        disabled: false,
      },
      {
        key: DataType.ElementType.Image,
        name: '图片',
        disabled: true,
      },
    ]
  },
  {
    key: 'file',
    name: '文件',
    children: [
      {
        key: DataType.ElementType.FileList,
        name: '文件概览',
        disabled: false,
      },
      {
        key: DataType.ElementType.FileManager,
        name: '文件管理',
        disabled: false,
      },
    ]
  },
  {
    key: 'table',
    name: '表格',
    children: [
      {
        key: DataType.ElementType.EditableTable,
        name: '可编辑表',
        disabled: false,
      },
      {
        key: DataType.ElementType.Table,
        name: '表格',
        disabled: true,
      },
    ],
  },
  {
    key: 'graph',
    name: '图形',
    children: [
      {
        key: DataType.ElementType.Lines,
        name: '折线图',
        disabled: true,
      },
      {
        key: DataType.ElementType.Histogram,
        name: '柱状图',
        disabled: true,
      },
      {
        key: DataType.ElementType.Pie,
        name: '饼图',
        disabled: true,
      },
      {
        key: DataType.ElementType.Scatter,
        name: '散点图',
        disabled: true,
      },
      {
        key: DataType.ElementType.Heatmap,
        name: '热力图',
        disabled: true,
      },
      {
        key: DataType.ElementType.Box,
        name: '箱图',
        disabled: true,
      },
      {
        key: DataType.ElementType.Tree,
        name: '树图',
        disabled: true,
      },
      {
        key: DataType.ElementType.TreeMap,
        name: '矩形树图',
        disabled: true,
      },
    ]
  },
]


export interface ModuleSelectorProps {
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  forwardedRef: React.Ref<ConvertRefFR>
}

export const moduleSelector = (moduleType: DataType.ElementType): React.FC<ModuleSelectorProps> =>
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

    switch (moduleType) {
      case DataType.ElementType.EmbedLink:
        return defaultModule
      case DataType.ElementType.Text:
        return textModule
      default:
        return defaultModule
    }
  }

