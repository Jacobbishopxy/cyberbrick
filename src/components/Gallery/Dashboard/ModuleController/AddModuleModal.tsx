/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useState } from 'react'
import { Card, Checkbox, Divider, Input, List, message, Modal, Space, Tabs } from "antd"
import { StarTwoTone } from "@ant-design/icons"

import * as DataType from "../../DataType"
import { moduleList } from "../ModulePanel/moduleSelector"

import styles from "./Common.less"

interface ModuleSelectionViewProps {
  onSelect: (value: string) => void
}

const ModuleSelectionView = (props: ModuleSelectionViewProps) =>
  <>
    {
      moduleList.map(chunk => (
        <div key={ chunk.key }>
          <Divider orientation="left">{ chunk.name }</Divider>
          <List
            grid={ { gutter: 24, column: 4 } }
            size="large"
            dataSource={ chunk.children }
            renderItem={ item => (
              <List.Item>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
                <label className={ styles.moduleSelectionLabel }>
                  <input type="radio" name="radio-name" disabled={ item.disabled } id={ item.key }/>
                  <div id={ item.key }>
                    <Card
                      onClick={ () => props.onSelect(item.key) }
                      className={ item.disabled ? styles.selectionCardDisabled : styles.selectionCard }
                    >
                      { item.name }
                    </Card>
                  </div>
                </label>
              </List.Item>
            ) }
          />
        </div>
      ))
    }
  </>

export interface AddModuleModalProps {
  onAddModule: (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => void
  visible: boolean
  onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

  const [selected, setSelected] = useState<string>()
  const [moduleName, setModuleName] = useState<string>()
  const [timeSeries, setTimeSeries] = useState<boolean>(false)

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setModuleName(e.target.value)

  const onSetOk = () => {
    if (selected && moduleName) {
      props.onQuit()
      props.onAddModule(moduleName, timeSeries, DataType.getElementType(selected))
    } else
      message.warn("Please enter your element name and select one module!")
  }


  // todo: Template selection
  return (
    <Modal
      title="Select module to add"
      visible={ props.visible }
      onOk={ onSetOk }
      onCancel={ props.onQuit }
      width="60%"
    >
      <Tabs defaultActiveKey="0">
        <Tabs.TabPane tab="Module" key="0">
          <Space>
            <StarTwoTone/>
            Please enter your module name:
            <Input size="small" style={ { width: 200 } } onChange={ inputOnChange }/>
          </Space>
          <br/>
          <Space>
            <StarTwoTone/>
            <Checkbox onChange={ e => setTimeSeries(e.target.checked) }>Time series</Checkbox>
          </Space>
          <ModuleSelectionView onSelect={ setSelected }/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Template" key="1">
          Template selection
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

