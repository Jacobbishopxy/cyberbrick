/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React from "react"
import {FormattedMessage} from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"


export const moduleList = [
  {
    key: 'misc',
    name: <FormattedMessage id="gallery.component.type.misc"/>,
    children: [
      {
        key: DataType.ElementType.EmbedLink,
        name: <FormattedMessage id="gallery.component.type.misc.link"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.Text,
        name: <FormattedMessage id="gallery.component.type.misc.text"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.TargetPrice,
        name: <FormattedMessage id="gallery.component.type.misc.target-price"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.Image,
        name: <FormattedMessage id="gallery.component.type.misc.image"/>,
        disabled: true,
      },
    ]
  },
  {
    key: 'file',
    name: <FormattedMessage id="gallery.component.type.file"/>,
    children: [
      {
        key: DataType.ElementType.FileList,
        name: <FormattedMessage id="gallery.component.type.file.file-overview"/>,
        disabled: true,
      },
      {
        key: DataType.ElementType.FileManager,
        name: <FormattedMessage id="gallery.component.type.file.file-manager"/>,
        disabled: false,
      },
    ]
  },
  {
    key: 'table',
    name: <FormattedMessage id="gallery.component.type.table"/>,
    children: [
      {
        key: DataType.ElementType.XlsxTable,
        name: <FormattedMessage id="gallery.component.type.table.xlsx-table"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.FlexTable,
        name: <FormattedMessage id="gallery.component.type.table.flex-table"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.Table,
        name: <FormattedMessage id="gallery.component.type.table.table"/>,
        disabled: true,
      },
    ],
  },
  {
    key: 'graph',
    name: <FormattedMessage id="gallery.component.type.graph"/>,
    children: [
      {
        key: DataType.ElementType.Line,
        name: <FormattedMessage id="gallery.component.type.graph.line"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.Bar,
        name: <FormattedMessage id="gallery.component.type.graph.bar"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.LineBar,
        name: <FormattedMessage id="gallery.component.type.graph.line-bar"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.Pie,
        name: <FormattedMessage id="gallery.component.type.graph.pie"/>,
        disabled: true,
      },
      {
        key: DataType.ElementType.Scatter,
        name: <FormattedMessage id="gallery.component.type.graph.scatter"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.LineScatter,
        name: <FormattedMessage id="gallery.component.type.graph.line-scatter"/>,
        disabled: false,
      },
      {
        key: DataType.ElementType.Heatmap,
        name: <FormattedMessage id="gallery.component.type.graph.heatmap"/>,
        disabled: true,
      },
      {
        key: DataType.ElementType.Box,
        name: <FormattedMessage id="gallery.component.type.graph.box"/>,
        disabled: true,
      },
      {
        key: DataType.ElementType.Tree,
        name: <FormattedMessage id="gallery.component.type.graph.tree"/>,
        disabled: true,
      },
      {
        key: DataType.ElementType.TreeMap,
        name: <FormattedMessage id="gallery.component.type.graph.treemap"/>,
        disabled: true,
      },
    ]
  },
]

