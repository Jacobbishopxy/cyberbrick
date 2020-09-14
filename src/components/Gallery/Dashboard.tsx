/**
 * Created by Jacob Xie on 7/30/2020.
 */

import React, { useState, useEffect, useReducer } from 'react';
import { message } from 'antd';
import RGL from 'react-grid-layout';

import { useDidMountEffect } from '@/utilities/utils';

import * as dashboardModel from '@/utilities/dashboardModel';
// import * as dashboardService from '@/services/eiDashboard';

import { DashboardEditor } from '@/components/Gallery/HeadPanel/DashboardEditor';
import { ModulePanel } from '@/components/Gallery/ModulePanel/ModulePanel';
import { SymbolSelector } from '@/components/Gallery/HeadPanel/SymbolSelector';
import { DashboardProps, ElementGeneratorProps } from './data';

import styles from './Dashboard.less';


const ReactGridLayout = RGL.WidthProvider(RGL);

const genEmptyLayout = (tp: dashboardModel.TemplatePanel): dashboardModel.Layout =>
  new dashboardModel.Layout(tp, [])

const elementGenerator = (props: ElementGeneratorProps) => {
  const {anchorKey, coordinate} = props.element;
  const anchor: dashboardModel.Anchor = {
    anchorKey,
    anchorConfig: props.globalConfig as dashboardModel.AnchorConfig
  }

  const removeItem = () => props.removeElement(anchorKey.identity)
  const updateContent = (value: dashboardModel.Content) =>
    props.updateStore({...anchor, content: value})
  const deleteContent = () =>
    props.deleteStore(anchor)


  return (
    <div key={anchorKey.identity} data-grid={coordinate}>
      <ModulePanel
        collection={props.collection}
        anchorKey={anchorKey}
        globalConfig={props.globalConfig}
        onRemove={removeItem}
        category={anchorKey.category}
        updateContent={updateContent}
        deleteContent={deleteContent}
        headVisible={props.headVisible}
      />
    </div>
  );
};


export const Dashboard: React.FC<DashboardProps> = (props) => {

  const [layout, setLayout] = useState<dashboardModel.Layout>(genEmptyLayout(props.templatePanel));
  const [stores, storesDispatcher] = useReducer(dashboardModel.storeReducer, []);
  const [storesToDelete, setStoresToDelete] = useState<dashboardModel.Anchor[]>([]);
  const [layoutSaveTrigger, setLayoutSaveTrigger] = useState<number>(0);
  const [dashboardOnEdit, setDashboardOnEdit] = useState<boolean>(false);
  const [globalConfig, setGlobalConfig] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // dashboardService
    //   .fetchLayout(props.collection, props.templatePanel)
    //   .then(data => {if (data !== null) setLayout(data) });
  }, [props.templatePanel]);

  useDidMountEffect(() => {

    // const layoutWithStore = new dashboardModel.LayoutWithStore(props.templatePanel, layout.layouts, stores!);
    //
    // dashboardService
    //   .modifyLayoutStore(props.collection, layoutWithStore)
    //   .then(() => message.success('保存成功'))
    //   .catch(() => message.warn('保存失败'));
    //
    // dashboardService
    //   .removeStores(props.collection, storesToDelete)
    //   .then(() => setStoresToDelete([]));

  }, [layoutSaveTrigger]);

  const onChangeSymbol = (value: string) => {
    setGlobalConfig({...globalConfig, symbol: value})
    return value;   // todo: fetch symbol name
  }

  const onAddElementToLayout = (selectedCategory: dashboardModel.CategoryType) =>
    setLayout(dashboardModel.addElementToLayout(layout, selectedCategory))

  const onChangeLayout = (rawLayout: dashboardModel.RawLayout[]) =>
    setLayout(dashboardModel.updateElementInLayout(layout, rawLayout))

  const onRemoveElementFromLayout = (value: string) =>
    setLayout(dashboardModel.removeElementFromLayout(layout, value));

  const onSaveModule = () =>
    setLayoutSaveTrigger(layoutSaveTrigger + 1);

  const elementUpdate = (value: dashboardModel.Store) =>
    storesDispatcher({
      type: dashboardModel.StoreActions.UPDATE,
      store: value
    });

  const elementDelete = (value: dashboardModel.Anchor) => {
    storesDispatcher({
      type: dashboardModel.StoreActions.DELETE,
      anchor: value
    });
    setStoresToDelete(storesToDelete.concat(value));
  }


  return (
    <div className={styles.main}>
      <div className={styles.controlMain}>
        {
          props.hasSymbolSelector ?
            <SymbolSelector
              onSelectSymbol={onChangeSymbol}
              defaultSymbol="000001" // todo: use local storage
            /> :
            <div/>
        }
        <DashboardEditor
          onAddModule={onAddElementToLayout}
          onSaveModule={onSaveModule}
          onEditModule={setDashboardOnEdit}
        />
      </div>

      <ReactGridLayout
        onLayoutChange={onChangeLayout}
        draggableHandle=".draggableHandler"
        className="layout"
        isDraggable={dashboardOnEdit}
        isResizable={dashboardOnEdit}
        cols={24}
        rowHeight={100}
        margin={[5, 5]}
        containerPadding={[10, 10]}
      >
        {
          layout.layouts.map(ele => elementGenerator({
            collection: props.collection,
            globalConfig,
            element: ele,
            removeElement: onRemoveElementFromLayout,
            updateStore: elementUpdate,
            deleteStore: elementDelete,
            headVisible: dashboardOnEdit,
          }))
        }
      </ReactGridLayout>

    </div>
  )
}
