/**
 * Created by Jacob Xie on 8/12/2020.
 */

import {useState} from "react"
import {Button, Input, Space} from "antd"
import {PageHeaderWrapper} from '@ant-design/pro-layout'

import {ExpiryType, LocalStorageHelper} from "@/utils/localStorageHelper"


const lsIdentifier = "ls-test"
const expiry = [1, "minute"] as ExpiryType
const ls = new LocalStorageHelper(lsIdentifier, {expiry})
const lsKey = "name"

export default () => {

  const [inputValue, setInputValue] = useState<string>("")

  const clearLs = () => ls.clear()

  const inputOnChange = (value: any) =>
    setInputValue(value.target.value)

  const submitLS = () =>
    ls.add(lsKey, inputValue)

  const dataDisplay = () => {
    const e = ls.get(lsKey)
    if (e !== null)
      return `Local storage data: ${e.data}`
    return "No data set"
  }

  const expiryDisplay = () => {
    const e = ls.get(lsKey)
    if (e?.expiry !== undefined)
      return `Local storage expiry: ${e.expiry}`
    return "No expiry set"
  }


  return (
    <PageHeaderWrapper>
      <Space direction="vertical">
        <h2>identifier: {lsIdentifier}</h2>
        <div>
          <Input
            placeholder="ls input"
            onBlur={inputOnChange}
            style={{width: 120}}
          />
          <Button
            onClick={submitLS}
            type="primary"
            style={{width: 120}}
          >
            Submit LS
          </Button>
          <Button
            onClick={clearLs}
            danger
            style={{width: 120}}
          >
            Clear LS
          </Button>
        </div>
        <div>
          <h1>{dataDisplay()}</h1>
          <h1>{expiryDisplay()}</h1>
          <h1>ls.getAllItemsByIdentifier():</h1>
          <pre>
            {JSON.stringify(ls.getAllItemsByIdentifier(), null, 2)}
          </pre>
          <h1>ls.getAllValuesByIdentifier():</h1>
          <pre>
            {JSON.stringify(ls.getAllValuesByIdentifier(), null, 2)}
          </pre>
        </div>
      </Space>
    </PageHeaderWrapper>
  )
}

