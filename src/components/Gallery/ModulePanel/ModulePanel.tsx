/**
 * Created by Jacob Xie on 7/31/2020.
 */


import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Modal, Space, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import * as dashboardModel from '@/utilities/dashboardModel';
import { Emoji } from '@/components/Emoji';
import { ConvertRefFR } from '@/components/Gallery/Collection/data.d';
import { fetchStore } from '@/services/eiDashboard';
import { selectModuleToAdd } from './ModuleList';
import { ModulePanelProps } from './data';

import styles from './ModulePanel.less';


export const ModulePanel = (props: ModulePanelProps) => {

  const contentRef = useRef<ConvertRefFR>(null);
  const selectModule = selectModuleToAdd(props.category)

  const anchor: dashboardModel.Anchor = {
    anchorKey: props.anchorKey,
    anchorConfig: props.globalConfig as dashboardModel.AnchorConfig
  }

  const [titleVisible, setTitleVisible] = useState<boolean>(true);
  const [editOn, setEditOn] = useState<boolean>(false);
  const [content, setContent] = useState<dashboardModel.Content | null>();

  // Read from sever and update to Dashboard.stores
  useEffect(() => {
    const fn = async () => {
      const res = await fetchStore(props.collection, anchor)
      if (res === null)
        setContent(res)
      else {
        setContent(res.content)
        props.updateContent(res.content)
      }
    }

    fn();
  }, []);

  // Delete this modulePanel and update to Dashboard.stores
  const confirmDelete = (onRemove: () => void) =>
    Modal.confirm({
      title: '是否删除该模块？',
      icon: <ExclamationCircleOutlined/>,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        props.deleteContent()
        onRemove()
      }
    });


  const changeTitle = (e: any) => {
    const {value} = e.target;
    if (value !== '') {
      const newContent: dashboardModel.Content = {...content!, title: value}
      setContent(newContent)
      props.updateContent(newContent)
    }
    else
      message.warning('标题不可为空')

    setTitleVisible(true);
  };

  const editContent = () => {
    setEditOn(!editOn);
    if (contentRef.current) contentRef.current.edit();
  }


  const panelHead = (ct: dashboardModel.Content | null) => {
    if (props.headVisible) return (
      <div className={styles.cardHead}>
        {
          titleVisible ?
            <Button
              type='link'
              size='small'
              onClick={() => setTitleVisible(false)}
            >
              {ct?.title === undefined ? '请输入标题' : ct.title}
            </Button> :
            <Input
              placeholder='请输入标题'
              size='small'
              allowClear
              onPressEnter={changeTitle}
              onBlur={changeTitle}
            />
        }
        <Space>
          <Tooltip title='拖拽'>
            <Button
              shape='circle'
              size='small'
              type='link'
              className='draggableHandler'
            >
              <Emoji label="drag" symbol="🧲️️️️️"/>
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              shape='circle'
              size='small'
              type='link'
              onClick={editContent}
            >
              {
                editOn ?
                  <Emoji label="edit" symbol="❌️"/> :
                  <Emoji label="edit" symbol="⚙️"/>
              }
            </Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button
              shape='circle'
              size='small'
              type='link'
              onClick={() => confirmDelete(props.onRemove)}
            >
              <Emoji label="delete" symbol="🗑️️️"/>
            </Button>
          </Tooltip>
        </Space>
      </div>
    )
    return <></>;
  }

  return (
    <div className={styles.cardMain}>
      {content === undefined ? <></> : panelHead(content)}

      {content === undefined ?
        <></> :
        selectModule({
          content,
          updateContent: props.updateContent,
          headVisible: props.headVisible,
          forwardedRef: contentRef
        })}
    </div>
  );

};

