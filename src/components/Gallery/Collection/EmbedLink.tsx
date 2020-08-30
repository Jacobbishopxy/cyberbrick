/**
 * Created by Jacob Xie on 7/31/2020.
 */


import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';

import * as dashboardModel from '@/utilities/dashboardModel';
import { ContentGenerator } from '@/components/Gallery/Collection/ContentGenerator';
import { ModuleInputField, ModuleDisplayField } from './data.d';

const InputField = (props: ModuleInputField) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<dashboardModel.Content | null>(props.content)


  const handleOk = (): void => {
    props.updateContent(content!)
    setVisible(false);
  }

  const inputOnChange = (e: any): void => setContent({data: e.target.value});

  return (
    <div className={props.styling}>
      <Button
        type='primary'
        shape='round'
        size='small'
        onClick={() => setVisible(true)}
      >
        点此输入链接
      </Button>
      <Modal
        title='请在下方输入链接：'
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Input
          placeholder='链接'
          allowClear
          onBlur={inputOnChange}
          defaultValue={content!.data}
        />
      </Modal>
    </div>
  )
};


const DisplayField = (props: ModuleDisplayField) =>
  <embed className={props.styling} src={props.content.data}/>;

export const EmbedLink = ContentGenerator({InputField, DisplayField});

