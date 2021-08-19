/**
 * Created by Jacob Xie on 10/19/2020.
 */

import { FormattedMessage } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"


export const moduleList = [
  {
    key: 'misc',
    name: <FormattedMessage id="gallery.component.type.misc" />,
    children: [
      {
        key: DataType.ElementType.EmbedLink,
        name: <FormattedMessage id="gallery.component.type.link" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Text,
        name: <FormattedMessage id="gallery.component.type.text" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Image,
        name: <FormattedMessage id="gallery.component.type.image" />,
        disabled: true,
      },
      {
        key: DataType.ElementType.NestedModule,
        name: <FormattedMessage id="gallery.component.type.nestedSimpleModule" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.FieldHeader,
        name: <FormattedMessage id="gallery.component.type.fieldHeader" />,
        disabled: false,
      },
    ]
  },
  {
    key: 'file',
    name: <FormattedMessage id="gallery.component.type.file" />,
    children: [
      {
        key: DataType.ElementType.FileOverview,
        name: <FormattedMessage id="gallery.component.type.fileOverview" />,
        disabled: true,
      },
      {
        key: DataType.ElementType.FileManager,
        name: <FormattedMessage id="gallery.component.type.fileManager" />,
        disabled: false,
      },
    ]
  },
  {
    key: 'table',
    name: <FormattedMessage id="gallery.component.type.table" />,
    children: [
      {
        key: DataType.ElementType.XlsxTable,
        name: <FormattedMessage id="gallery.component.type.xlsxTable" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.FlexTable,
        name: <FormattedMessage id="gallery.component.type.flexTable" />,
        disabled: false,
      },
    ],
  },
  {
    key: "investment",
    name: <FormattedMessage id="gallery.component.type.investment" />,
    children: [
      {
        key: DataType.ElementType.TargetPrice,
        name: <FormattedMessage id="gallery.component.type.targetPrice" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Universe,
        name: <FormattedMessage id="gallery.component.type.universe" />,
        disabled: true,
      },
    ]
  },
  {
    key: 'graph',
    name: <FormattedMessage id="gallery.component.type.graph" />,
    children: [
      {
        key: DataType.ElementType.Line,
        name: <FormattedMessage id="gallery.component.type.line" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Bar,
        name: <FormattedMessage id="gallery.component.type.bar" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.LineBar,
        name: <FormattedMessage id="gallery.component.type.lineBar" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Scatter,
        name: <FormattedMessage id="gallery.component.type.scatter" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.LineScatter,
        name: <FormattedMessage id="gallery.component.type.lineScatter" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Pie,
        name: <FormattedMessage id="gallery.component.type.pie" />,
        disabled: false,
      },
      {
        key: DataType.ElementType.Heatmap,
        name: <FormattedMessage id="gallery.component.type.heatmap" />,
        disabled: true,
      },
      {
        key: DataType.ElementType.Box,
        name: <FormattedMessage id="gallery.component.type.box" />,
        disabled: true,
      },
      {
        key: DataType.ElementType.Tree,
        name: <FormattedMessage id="gallery.component.type.tree" />,
        disabled: true,
      },
      {
        key: DataType.ElementType.TreeMap,
        name: <FormattedMessage id="gallery.component.type.treemap" />,
        disabled: true,
      },
    ]
  },
]

