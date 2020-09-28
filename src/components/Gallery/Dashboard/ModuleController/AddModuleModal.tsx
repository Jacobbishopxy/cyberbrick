/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useState } from 'react'
import { Card, Divider, Input, List, message, Modal, Space, Tabs } from "antd"

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
  onAddModule: (name: string, value: DataType.ElementType) => void
  visible: boolean
  onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

  const [selected, setSelected] = useState<string>()
  const [moduleName, setModuleName] = useState<string>()

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setModuleName(e.target.value)

  const onSetOk = () => {
    if (selected && moduleName) {
      props.onQuit()
      props.onAddModule(moduleName, DataType.getElementType(selected))
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
            Please enter your module name:
            <Input size="small" style={{width: 200}} onChange={ inputOnChange }/>
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

