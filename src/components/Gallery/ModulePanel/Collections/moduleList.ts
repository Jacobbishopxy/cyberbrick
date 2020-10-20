/**
 * Created by Jacob Xie on 10/19/2020.
 */

import * as DataType from "@/components/Gallery/GalleryDataType"


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
        key: DataType.ElementType.Bar,
        name: 'Bar',
        disabled: false,
      },
      {
        key: DataType.ElementType.LineBar,
        name: 'Line & bar',
        disabled: false,
      },
      {
        key: DataType.ElementType.Pie,
        name: 'Pie',
        disabled: false,
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

