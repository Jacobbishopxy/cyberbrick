/**
 * Created by Jacob Xie on 8/12/2020.
 */

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import { Button, Input } from "antd";
// import moment from "moment";

import { LocalStorageWorker } from "@/utils/localStorageWorker";


const lsIdentifier = "ls-test"
const ls = new LocalStorageWorker(lsIdentifier)

export default () => {

  const clearLs = () => ls.clear()

  const inputOnChange = (value: any) => {
    ls.add("name", value.target.value)
  }

  // todo: ls with expired time

  return (
    <PageHeaderWrapper>
      <h1>identifier: { lsIdentifier }</h1>
      <Button
        onClick={ clearLs }
      >
        Clear LS
      </Button>
      <Input
        defaultValue={ ls.get("name") || "null" }
        onBlur={ inputOnChange }
        style={ { width: 120 } }
      />
      <pre>
        { JSON.stringify(ls.getAllItemsByIdentifier(), null, 2) }
      </pre>
    </PageHeaderWrapper>
  );
};
