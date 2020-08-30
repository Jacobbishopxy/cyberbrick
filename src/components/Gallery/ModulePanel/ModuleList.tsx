/**
 * Created by Jacob Xie on 7/31/2020.
 */

import React from 'react';

import * as dashboardModel from '@/utilities/dashboardModel';
import { EmbedLink } from '@/components/Gallery/Collection/EmbedLink';
import { ConvertRefFR } from '@/components/Gallery/Collection/data.d';

import styles from './ModulePanel.less';


export const moduleList = [
  {
    key: 'misc',
    name: '功能',
    children: [
      {
        key: dashboardModel.CategoryType.embedLink,
        name: '链接',
        disabled: false,
      },
      {
        key: dashboardModel.CategoryType.text,
        name: '文字',
        disabled: false,
      },
      {
        key: dashboardModel.CategoryType.targetPrice,
        name: '目标价',
        disabled: false,
      },
      {
        key: dashboardModel.CategoryType.image,
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
        key: dashboardModel.CategoryType.fileList,
        name: '文件概览',
        disabled: false,
      },
      {
        key: dashboardModel.CategoryType.fileManager,
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
        key: dashboardModel.CategoryType.editableTable,
        name: '可编辑表',
        disabled: false,
      },
      {
        key: dashboardModel.CategoryType.table,
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
        key: dashboardModel.CategoryType.lines,
        name: '折线图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.histogram,
        name: '柱状图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.pie,
        name: '饼图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.scatter,
        name: '散点图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.heatmap,
        name: '热力图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.box,
        name: '箱图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.tree,
        name: '树图',
        disabled: true,
      },
      {
        key: dashboardModel.CategoryType.treeMap,
        name: '矩形树图',
        disabled: true,
      },
    ]
  },
];


export interface SelectedModuleProps {
  content: dashboardModel.Content | null,
  updateContent: (a: dashboardModel.Content) => void,
  headVisible: boolean,
  forwardedRef: React.Ref<ConvertRefFR>
}

export const selectModuleToAdd =
  (moduleName: dashboardModel.CategoryType): React.FC<SelectedModuleProps> =>
    (props: SelectedModuleProps) => {

      const styling = props.headVisible ? styles.cardContent : styles.cardContentWithOutHead;

      const defaultType = <EmbedLink
        content={props.content}
        updateContent={props.updateContent}
        ref={props.forwardedRef}
        styling={styling}
      />

      switch (moduleName) {
        case dashboardModel.CategoryType.embedLink:
          return defaultType;
        default:
          return defaultType;
      }

    }

