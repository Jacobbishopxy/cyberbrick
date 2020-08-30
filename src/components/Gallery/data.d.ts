/**
 * Created by Jacob Xie on 8/5/2020.
 */

import * as dashboardModel from '@/utilities/dashboardModel';


export interface DashboardProps {
  layoutDb: dashboardModel.DbType;
  storeDb: dashboardModel.DbType;
  collection: string;
  templatePanel: dashboardModel.TemplatePanel;
  hasSymbolSelector: boolean;
}

export interface ElementGeneratorProps {
  collection: string
  globalConfig: Record<string, any> | null
  element: dashboardModel.Element
  removeElement: (value: string) => void
  updateStore: (value: dashboardModel.Store) => void
  deleteStore: (value: dashboardModel.Anchor) => void
  headVisible: boolean
}


export interface Content {
  id?: string
  element: Element
  date: string
  symbol?: string
  title: string
  text: string
}

export interface Dashboard {
  name: string
  templates: Template[]
  description?: string
}

export interface Element {
  id?: string
  template?: Template
  contents?: Content[]
  name: string
  x: number
  y: number
  h: number
  w: number
}

export interface Template {
  id?: string
  dashboard: Dashboard
  elements?: Element[]
  description?: string
}

