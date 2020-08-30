/**
 * Created by Jacob Xie on 8/4/2020.
 */


import React, { forwardRef, useImperativeHandle, useState } from 'react';

import * as dashboardModel from '@/utilities/dashboardModel';
import { ContentGeneratorProps, ConvertProps, ConvertRefFR, ConvertRefProps } from './data.d';

import styles from './Common.less';


const emptyContent: dashboardModel.Content = {data: ''}

export const ContentGenerator = (cgProps: ContentGeneratorProps) => {

  const ConvertRef: React.FC<ConvertRefProps> = (crProps: ConvertRefProps) => {
    const [editable, setEditable] = useState<boolean>(false);
    const [content, setContent] = useState<dashboardModel.Content | null>(crProps.content);

    const updateContent = (a: dashboardModel.Content) => {
      setContent(a);
      crProps.updateContent(a);
    };

    useImperativeHandle(crProps.forwardedRef, () => ({
      edit: () => setEditable(!editable)
    }));

    return <>
      {
        content === null || editable ?
          <cgProps.InputField
            content={emptyContent}
            updateContent={updateContent}
            styling={styles.cardContentAlter}
          /> :
          <cgProps.DisplayField
            content={content}
            styling={crProps.styling}
          />
      }
    </>
  };

  return forwardRef((props: ConvertProps, ref: React.Ref<ConvertRefFR>) =>
    <ConvertRef
      content={props.content}
      updateContent={props.updateContent}
      forwardedRef={ref}
      styling={props.styling}
    />
  );
};

