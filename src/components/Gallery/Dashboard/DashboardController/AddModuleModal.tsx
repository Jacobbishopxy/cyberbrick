/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useState } from 'react'
import { Card, Divider, List, Modal, Tabs } from "antd"

import * as DataType from "../../DataType"
import { moduleList } from "../ModulePanel/moduleSelector"

import styles from "./Common.less"

interface ModuleSelectionViewProps {
  onSelect: (value: DataType.ElementType) => void
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
  onAddModule: (value: DataType.ElementType) => void
  visible: boolean
  onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

  const [selected, setSelected] = useState<string>()

  const onSetOk = () => {
    if (selected) {
      props.onQuit()
      props.onAddModule(DataType.ElementType[selected])
    }
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
          <ModuleSelectionView onSelect={ setSelected }/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Template" key="1">
          Template selection
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

