/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, {useState} from 'react'
import {Checkbox, Divider, Input, List, message, Modal,  Space, Tabs, Tooltip} from "antd"
import {ExclamationCircleTwoTone, RightOutlined, StarTwoTone} from "@ant-design/icons"

import * as DataType from "../../GalleryDataType"
import {moduleList} from "../../ModulePanel/Collections"
import {SelectorPanel} from "./SelectorPanel"

import styles from "./Common.less"


interface ModuleSelectionListProps {
  onSelect: (value: string) => void
}

const ModuleSelectionList = (props: ModuleSelectionListProps) =>
  <>
    {moduleList.map(chunk => (
      <div key={chunk.key}>
        <Divider orientation="left">{chunk.name}</Divider>
        <List
          grid={{column: 6}}
          size="small"
          dataSource={chunk.children}
          renderItem={item => (
            <List.Item>
              <label className={styles.moduleSelectionLabel}>
                <input type="radio" name="radio-name" disabled={item.disabled} id={item.key}/>
                <div
                  id={item.key}
                  onClick={() => props.onSelect(item.key)}
                  className={item.disabled ? styles.selectionCardDisabled : styles.selectionCard}
                >
                  {item.name}
                </div>
              </label>
            </List.Item>
          )}
        />
      </div>
    ))}
  </>

interface ModuleSelectionViewProps {
  setName: (value: string) => void
  setTimeSeries: (value: boolean) => void
  setSelected: (value: string) => void
}

const ModuleSelectionView = (props: ModuleSelectionViewProps) =>
  <>
    <Space direction="vertical">
      <Space>
        <StarTwoTone/>
        <span style={{width: 250, fontSize: 15}}>Please enter your module name:</span>
      </Space>
      <Space>
        <RightOutlined/>
        <Input size="small" style={{width: 200}} onChange={e => props.setName(e.target.value)}/>
        <Tooltip title="Duplicated module name is not allowed!">
          <ExclamationCircleTwoTone twoToneColor="red"/>
        </Tooltip>
      </Space>
      <Space>
        <StarTwoTone/>
        <span style={{width: 250, fontSize: 15}}>Please check options you need:</span>
      </Space>
      <Space>
        <RightOutlined/>
        <Checkbox onChange={e => props.setTimeSeries(e.target.checked)}>Time series</Checkbox>
      </Space>
    </Space>
    <ModuleSelectionList onSelect={props.setSelected}/>
  </>


interface TemplateSelectionViewProps {
  categories: DataType.Category[]
  categoryOnSelect: (categoryName: string) => Promise<DataType.Category>
  dashboardOnSelect: (id: string) => Promise<DataType.Dashboard>
  onSelectedTemplate: (templateId: string) => void
}

const TemplateSelectionView = (props: TemplateSelectionViewProps) => {

  return (
    <Space direction="vertical" style={{marginBottom: 20}}>
      <Space>
        <StarTwoTone/>
        <span style={{fontSize: 15}}>Please select one of template in dashboard to copy:</span>
      </Space>
      <Space>
        <RightOutlined/>
        {/*<SelectorPanel*/}
        {/*  categories={props.categories}*/}
        {/*  categoryOnSelect={props.categoryOnSelect}*/}
        {/*  dashboardOnSelect={onSelectDashboard}*/}
        {/*/>*/}
        {/*<Select*/}
        {/*  style={{width: 120}}*/}
        {/*  onSelect={props.onSelectedTemplate}*/}
        {/*  placeholder="Template"*/}
        {/*  size="small"*/}
        {/*>*/}
        {/*  {templates.map(t => <Select.Option key={t.id} value={t.id!}>{t.name}</Select.Option>)}*/}
        {/*</Select>*/}

        <SelectorPanel
          categories={props.categories}
          categoryOnSelect={props.categoryOnSelect}
          dashboardOnSelect={props.dashboardOnSelect}
          onSelectFinish={props.onSelectedTemplate}
          size="small"
        />

        <Tooltip title="Copy elements to non-empty template is forbidden!">
          <ExclamationCircleTwoTone twoToneColor="red"/>
        </Tooltip>
      </Space>
    </Space>
  )
}

export interface AddModuleModalProps {
  onAddModule: (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => void
  categories: DataType.Category[]
  categoryOnSelect: (categoryName: string) => Promise<DataType.Category>
  dashboardOnSelect: (id: string) => Promise<DataType.Dashboard>
  copyTemplate: (originTemplateId: string) => void
  visible: boolean
  onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

  const [selected, setSelected] = useState<string>()
  const [moduleName, setModuleName] = useState<string>()
  const [timeSeries, setTimeSeries] = useState<boolean>(false)
  const [selectedPane, setSelectedPane] = useState<string>("Module")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>()

  const onSetOk = () => {
    if (selectedPane === "Module") {
      if (selected && moduleName) {
        props.onQuit()
        props.onAddModule(moduleName, timeSeries, DataType.getElementType(selected))
      } else
        message.warn("Please enter your element name and select one module!")
    }
    if (selectedPane === "Template") {
      if (selectedTemplateId) {
        props.onQuit()
        props.copyTemplate(selectedTemplateId)
      }
    }
  }

  return (
    <Modal
      title="Select module to add"
      visible={props.visible}
      onOk={onSetOk}
      onCancel={props.onQuit}
      width="60%"
      okText="Confirm"
      cancelText="Discard"
      bodyStyle={{paddingTop: 0, paddingBottom: 0}}
      style={{top: 40}}
    >
      <Tabs
        defaultActiveKey={selectedPane}
        onChange={setSelectedPane}
      >
        <Tabs.TabPane tab="Module" key="Module">
          <ModuleSelectionView
            setName={setModuleName}
            setTimeSeries={setTimeSeries}
            setSelected={setSelected}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Template" key="Template">
          <TemplateSelectionView
            categories={props.categories}
            categoryOnSelect={props.categoryOnSelect}
            dashboardOnSelect={props.dashboardOnSelect}
            onSelectedTemplate={setSelectedTemplateId}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

