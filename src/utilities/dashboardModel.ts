/**
 * Created by Jacob Xie on 7/23/2020.
 */

import _ from 'lodash';
import { currentTimeStamp } from '@/utilities/utils';

export enum DbType {
  template = 'template',
  industry = 'industry',
  market = 'market',
}

export enum CategoryType {
  embedLink = 'embedLink',
  text = 'text',
  targetPrice = 'targetPrice',
  image = 'image',
  fileList = 'fileList',
  fileManager = 'fileManager',
  editableTable = 'editableTable',
  table = 'table',
  lines = 'lines',
  histogram = 'histogram',
  pie = 'pie',
  scatter = 'scatter',
  heatmap = 'heatmap',
  box = 'box',
  tree = 'tree',
  treeMap = 'treeMap',
}

export interface RawLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  isBounded?: boolean;
}

export interface AnchorKey {
  identity: string;
  category: CategoryType;
}

export interface AnchorConfig {
  symbol?: string;
  date?: string;
}

export interface Anchor {
  anchorKey: AnchorKey;
  anchorConfig?: AnchorConfig;
}

export interface Content {
  title?: string;
  data: string;
  config?: Record<string, any>;
}

export interface Store {
  anchorKey: AnchorKey;
  content: Content;
  anchorConfig?: AnchorConfig;
}

export interface Coordinate {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Element {
  anchorKey: AnchorKey;
  coordinate: Coordinate;
}

export interface TemplatePanel {
  template: string;
  panel: string;
}

export class Layout {
  constructor(public templatePanel: TemplatePanel,
              public layouts: Element[]) {
    this.templatePanel = templatePanel;
    this.layouts = layouts;
  }
}

export class LayoutWithStore {
  constructor(public templatePanel: TemplatePanel,
              public layouts: Element[],
              public stores: Store[]) {
    this.templatePanel = templatePanel;
    this.layouts = layouts;
    this.stores = stores;
  }
}


// layout handlers

export const addElementToLayout = (layout: Layout, category: CategoryType): Layout => {
  const newElement: Element = {
    anchorKey: {
      identity: currentTimeStamp(),
      category
    },
    coordinate: {
      x: 0,
      y: Infinity,
      h: 4,
      w: 8,
    }
  };
  const newLayouts: Element[] = _.concat(layout.layouts, newElement);

  return new Layout(layout.templatePanel, newLayouts);
};

export const removeElementFromLayout = (layout: Layout, identity: string): Layout => {
  const newLayouts: Element[] = _.reject(layout.layouts, ele => (ele.anchorKey.identity === identity))

  return new Layout(layout.templatePanel, newLayouts);
};

export const updateElementInLayout = (layout: Layout, rawLayout: RawLayout[]): Layout => {
  const newLayouts: Element[] =
    _.zip(layout.layouts, rawLayout).map(item => {

      const ele: Element = item[0]!
      const rlo: RawLayout = item[1]!

      return {
        anchorKey: {
          ...ele.anchorKey,
        },
        coordinate: {
          x: rlo.x,
          y: rlo.y,
          h: rlo.h,
          w: rlo.w,
        }
      }
    });

  return new Layout(layout.templatePanel, newLayouts);
};

// store handlers

export enum StoreActions {
  UPDATE,
  DELETE,
}

export type StoreAction =
  | { type: StoreActions.UPDATE, store: Store }
  | { type: StoreActions.DELETE, anchor: Anchor }


export const initStores = (stores: Store[]) => stores;

const matchStore = (ele: Store, payload: Store | Anchor) =>
  _.isEqual(ele.anchorKey, payload.anchorKey) &&
  _.isEqual(ele.anchorConfig, payload.anchorConfig);


export const storeReducer = (state: Store[], action: StoreAction) => {
  switch (action.type) {
    case StoreActions.UPDATE:
      if (_.findIndex(state, (ele: Store) => matchStore(ele, action.store)) === -1) {
        return _.concat(state, action.store);
      }
      return _.map(state, ele => (matchStore(ele, action.store) ? action.store : ele));
    case StoreActions.DELETE:
      return _.filter(state, ele => !matchStore(ele, action.anchor));
    default:
      return state;
  }
};

