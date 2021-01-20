/**
 * Created by Jacob Xie on 1/20/2021
 */


export interface AnchorType {
  id: string
  name: string
  children?: AnchorType[]
}

export const anchorList: AnchorType[] = [
  {
    id: "1-base-config",
    name: "1. 基础配置",
    children: [
      {
        id: "1-a-database-config",
        name: "a. 数据库"
      },
      {
        id: "1-b-category",
        name: "b. 族群"
      },
      {
        id: "1-c-dashboard",
        name: "c. 仪表盘"
      },
    ]
  },
  {
    id: "2-dataset",
    name: "2. 数据集",
    children: [
      {
        id: "2-a-import-export",
        name: "a. 导入/导出数据"
      },
      {
        id: "2-b-query",
        name: "b. 查询数据"
      },
    ]
  },
  {
    id: "3-dashboard",
    name: "3. 仪表盘",
    children: [
      {
        id: "3-a-view",
        name: "a. 查看"
      },
      {
        id: "3-b-edit",
        name: "b. 编辑",
        children: [
          {
            id: "3-b-module-link",
            name: "[模板]链接"
          },
          {
            id: "3-b-module-text",
            name: "[模板]文章"
          },
          {
            id: "3-b-module-target-price",
            name: "[模板]目标价"
          },
          {
            id: "3-b-module-file-management",
            name: "[模板]文件管理"
          },
          {
            id: "3-b-module-table",
            name: "[模板]表格"
          },
          {
            id: "3-b-module-line",
            name: "[模板]折线图"
          },
          {
            id: "3-b-module-bar",
            name: "[模板]柱状图"
          },
          {
            id: "3-b-module-line-bar",
            name: "[模板]折线柱状混合图"
          },
        ]
      },
    ]
  },
]
