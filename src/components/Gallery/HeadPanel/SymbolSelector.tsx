/**
 * Created by Jacob Xie on 8/11/2020.
 */

import React, { useState } from 'react';
import { Input } from 'antd';
import { SymbolSelectorProps } from '@/components/Gallery/HeadPanel/data';


export const SymbolSelector = (props: SymbolSelectorProps) => {

  const [symbolName, setSymbolName] = useState<string>('');

  const onSelectSymbol = (value: any) => {
    const sn = props.onSelectSymbol(value.target.value)
    setSymbolName(sn)
  };

  const inputField = <Input
    onPressEnter={onSelectSymbol}
    onBlur={onSelectSymbol}
    defaultValue={props.defaultSymbol}
    placeholder="股票代码"
    size="small"
    style={{width: 120, marginRight: 5}}
  />

  return (
    <>
      {inputField}
      <span style={{fontWeight: 'bold', fontSize: 18, marginLeft: 10}}>{symbolName}</span>
    </>
  );
};
