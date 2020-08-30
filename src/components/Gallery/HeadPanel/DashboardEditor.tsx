/**
 * Created by Jacob Xie on 8/5/2020.
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, List, Modal, Tabs, Space, Input } from 'antd';

import * as dashboardModel from '@/utilities/dashboardModel';
import { moduleList } from '@/components/Gallery/ModulePanel/ModuleList';
import {
  AddModuleModalProps,
  ConfirmSaveModalProps,
  DashboardEditorProps,
  ModuleSelectionViewProps
} from '@/components/Gallery/HeadPanel/data';

import styles from './Common.less';


const ModuleSelectionView = (props: ModuleSelectionViewProps) => (
  <>
    {moduleList.map(chunk => (
      <div key={chunk.key}>
        <Divider orientation="left">{chunk.name}</Divider>
        <List
          grid={{gutter: 24, column: 4}}
          size='large'
          dataSource={chunk.children}
          renderItem={item => (
            <List.Item>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
              <label className={styles.moduleSelectionLabel}>
                <input type="radio" name="radio-name" disabled={item.disabled} id={item.key}/>
                <div id={item.key}>
                  <Card
                    onClick={() => props.onSelectModule(item.key)}
                    className={item.disabled ? styles.selectionCardDisabled : styles.selectionCard}
                  >
                    {item.name}
                  </Card>
                </div>
              </label>
            </List.Item>
          )}
        />
      </div>
    ))}
  </>
);

const AddModuleModal = (props: AddModuleModalProps) => {

  const [selected, setSelected] = useState<string | null>(null);

  const onSelectModule = (value: string) => setSelected(value);
  const onSetOk = () => {
    if (selected !== null) {
      props.onOk();
      props.onAddModule(dashboardModel.CategoryType[selected]);
    }
  }

  return (
    <Modal
      title="请选择需要添加的模块"
      visible={props.visible}
      onOk={onSetOk}
      onCancel={props.onCancel}
      okText="确定"
      cancelText="取消"
      width="60%"
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="模块方案" key="1">
          <ModuleSelectionView onSelectModule={onSelectModule}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="空模板方案" key="2">
          Template selection
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

const ConfirmSaveModal = (props: ConfirmSaveModalProps) => {

  const [templateName, setTemplateName] = useState<string>(props.template);

  const inputBlur = (e: any) => setTemplateName(e);
  const buttonClick = () => props.onSaveTemplate(templateName);

  return (
    <Modal
      title="保存编辑结果"
      visible={props.visible}
      onCancel={props.onCancel}
      footer={<Button onClick={props.onOk}>退出编辑</Button>}
    >
      <Space direction="vertical">
        <Space>
          保存模板：
          <Input
            defaultValue={templateName}
            onBlur={inputBlur}
            style={{width: 200}}
            disabled
          />
          <Button
            onClick={buttonClick}
            disabled
          >
            确认
          </Button>
        </Space>
        <br/>
        <Space>
          保存布局：
          <Button
            type="primary"
            onClick={props.onSaveModule}
          >
            确认
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};


export const DashboardEditor = (props: DashboardEditorProps) => {

  const [edit, setEdit] = useState<boolean>(false);
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false);
  const [confirmSaveModalVisible, setConfirmSaveModalVisible] = useState<boolean>(false);

  useEffect(() => props.onEditModule(edit), [edit]);

  const startEdit = () => setEdit(true);
  const quitEdit = () => {
    setConfirmSaveModalVisible(false);
    setEdit(false);
  };


  const editMode = (
    <div>
      <Button
        type="primary"
        size="small"
        style={{marginRight: 5}}
        onClick={() => setAddModuleModalVisible(true)}
      >
        添加模块
      </Button>
      <Button
        size="small"
        danger
        style={{marginRight: 5}}
        onClick={() => setConfirmSaveModalVisible(true)}
      >
        退出编辑
      </Button>

      <AddModuleModal
        onAddModule={props.onAddModule}
        visible={addModuleModalVisible}
        onOk={() => setAddModuleModalVisible(false)}
        onCancel={() => setAddModuleModalVisible(false)}
      />

      <ConfirmSaveModal
        onSaveModule={props.onSaveModule}
        template="dev" // todo
        onSaveTemplate={t => console.log(`on save template: ${t}`)}
        visible={confirmSaveModalVisible}
        onOk={quitEdit}
        onCancel={() => setConfirmSaveModalVisible(false)}
      />
    </div>
  )

  const idleMode = (
    <Button
      onClick={startEdit}
      type="primary"
      size="small"
      style={{marginRight: 5}}
    >
      编辑
    </Button>
  )

  return edit ? editMode : idleMode
};

