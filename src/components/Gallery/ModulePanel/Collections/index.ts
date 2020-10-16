/**
 * Created by Jacob Xie on 10/11/2020.
 */

import { collectionSelector } from "./collectionSelector"
import * as DataType from "../../GalleryDataType"

import { XlsxTable } from "./XlsxTable"
import { EmbedLink } from "./EmbedLink"
import { Text } from "./Text"
import { TargetPrice } from "./TargetPrice"
import { Line } from "./Line"

export { collectionSelector }

export const moduleList = [
  {
    key: 'misc',
    name: 'Misc',
    children: [
      {
        key: DataType.ElementType.EmbedLink,
        name: 'Link',
        disabled: false,
      },
      {
        key: DataType.ElementType.Text,
        name: 'Text',
        disabled: false,
      },
      {
        key: DataType.ElementType.TargetPrice,
        name: 'Target price',
        disabled: false,
      },
      {
        key: DataType.ElementType.Image,
        name: 'Image',
        disabled: true,
      },
    ]
  },
  {
    key: 'file',
    name: 'File',
    children: [
      {
        key: DataType.ElementType.FileList,
        name: 'File overview',
        disabled: false,
      },
      {
        key: DataType.ElementType.FileManager,
        name: 'File manager',
        disabled: false,
      },
    ]
  },
  {
    key: 'table',
    name: 'Table',
    children: [
      {
        key: DataType.ElementType.XlsxTable,
        name: 'Xlsx table',
        disabled: false,
      },
      {
        key: DataType.ElementType.Table,
        name: 'Table',
        disabled: true,
      },
    ],
  },
  {
    key: 'graph',
    name: 'Graph',
    children: [
      {
        key: DataType.ElementType.Line,
        name: 'Line',
        disabled: false,
      },
      {
        key: DataType.ElementType.Histogram,
        name: 'Histogram',
        disabled: true,
      },
      {
        key: DataType.ElementType.Pie,
        name: 'Pie',
        disabled: true,
      },
      {
        key: DataType.ElementType.Scatter,
        name: 'Scatter',
        disabled: true,
      },
      {
        key: DataType.ElementType.Heatmap,
        name: 'Heatmap',
        disabled: true,
      },
      {
        key: DataType.ElementType.Box,
        name: 'Box',
        disabled: true,
      },
      {
        key: DataType.ElementType.Tree,
        name: 'Tree',
        disabled: true,
      },
      {
        key: DataType.ElementType.TreeMap,
        name: 'Tree map',
        disabled: true,
      },
    ]
  },
]

export {
  XlsxTable,
  EmbedLink,
  Text,
  TargetPrice,
  Line
}

