/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'
import { Card, Checkbox, Divider, Input, List, message, Modal, Select, Space, Tabs, Tooltip } from "antd"
import { ExclamationCircleTwoTone, RightOutlined, StarTwoTone } from "@ant-design/icons"
import _ from "lodash"

import * as DataType from "../../GalleryDataType"
import { moduleList } from "../../ModulePanel/Collections"

import styles from "./Common.less"


interface ModuleSelectionListProps {
  onSelect: (value: string) => void
}

const ModuleSelectionList = (props: ModuleSelectionListProps) =>
  <>
    { moduleList.map(chunk => (
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
    )) }
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
        <span style={ { width: 250, fontSize: 15 } }>Please enter your module name:</span>
      </Space>
      <Space>
        <RightOutlined/>
        <Input size="small" style={ { width: 200 } } onChange={ e => props.setName(e.target.value) }/>
        <Tooltip title="Duplicated module name is not allowed!">
          <ExclamationCircleTwoTone twoToneColor="red"/>
        </Tooltip>
      </Space>
      <Space>
        <StarTwoTone/>
        <span style={ { width: 250, fontSize: 15 } }>Please check options you need:</span>
      </Space>
      <Space>
        <RightOutlined/>
        <Checkbox onChange={ e => props.setTimeSeries(e.target.checked) }>Time series</Checkbox>
      </Space>
    </Space>
    <ModuleSelectionList onSelect={ props.setSelected }/>
  </>

interface SelectedDashboardTemplate {
  dashboard: string
  template: string
}

interface TemplateSelectionViewProps {
  dashboards: GalleryAPI.Dashboard[]
  onSelectedDashboardTemplate: (d: SelectedDashboardTemplate) => void
}

const TemplateSelectionView = (props: TemplateSelectionViewProps) => {

  const [selectedDashboardTemplate, setSelectedDashboardTemplate] = useState<SelectedDashboardTemplate>()
  const [templates, setTemplates] = useState<string[]>([])

  useEffect(() => {
    if (selectedDashboardTemplate)
      props.onSelectedDashboardTemplate(selectedDashboardTemplate)
  }, [selectedDashboardTemplate])

  const onSelectDashboard = (value: string) => {
    const dsb = _.find(props.dashboards, d => d.name === value)!
    const tpl = dsb.templates!.map(t => t.name)
    setTemplates(tpl)
    setSelectedDashboardTemplate({ dashboard: value, template: tpl[0] })
  }

  const onSelectTemplate = (value: string) => {
    if (selectedDashboardTemplate)
      setSelectedDashboardTemplate({ ...selectedDashboardTemplate, template: value })
  }

  return (
    <Space direction="vertical">
      <Space>
        <StarTwoTone/>
        <span style={ { fontSize: 15 } }>Please select one of template in dashboard to copy:</span>
      </Space>
      <Space>
        <RightOutlined/>
        <Select
          style={ { width: 120 } }
          onSelect={ onSelectDashboard }
          placeholder="Dashboard"
          size="small"
        >
          {
            props.dashboards.map(d =>
              <Select.Option key={ d.name } value={ d.name }>{ d.name }</Select.Option>
            )
          }
        </Select>
        <Select
          style={ { width: 120 } }
          onSelect={ onSelectTemplate }
          placeholder="Template"
          size="small"
        >
          {
            templates.map(t =>
              <Select.Option key={ t } value={ t }>{ t }</Select.Option>
            )
          }
        </Select>
        <Tooltip title="Copy elements to non-empty template is forbidden!">
          <ExclamationCircleTwoTone twoToneColor="red"/>
        </Tooltip>
      </Space>
    </Space>
  )
}

export interface AddModuleModalProps {
  dashboards: GalleryAPI.Dashboard[]
  onAddModule: (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => void
  copyTemplate: (dashboardName: string, templateName: string) => void
  visible: boolean
  onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

  const [selected, setSelected] = useState<string>()
  const [moduleName, setModuleName] = useState<string>()
  const [timeSeries, setTimeSeries] = useState<boolean>(false)
  const [selectedPane, setSelectedPane] = useState<string>("Module")
  const [selectedDashboardTemplate, setSelectedDashboardTemplate] = useState<SelectedDashboardTemplate>()

  const onSetOk = () => {
    if (selectedPane === "Module") {
      if (selected && moduleName) {
        props.onQuit()
        props.onAddModule(moduleName, timeSeries, DataType.getElementType(selected))
      } else
        message.warn("Please enter your element name and select one module!")
    }
    if (selectedPane === "Template") {
      if (selectedDashboardTemplate) {
        props.onQuit()
        props.copyTemplate(selectedDashboardTemplate.dashboard, selectedDashboardTemplate.template)
      }
    }
  }

  return (
    <Modal
      title="Select module to add"
      visible={ props.visible }
      onOk={ onSetOk }
      onCancel={ props.onQuit }
      width="60%"
    >
      <Tabs
        defaultActiveKey={ selectedPane }
        onChange={ setSelectedPane }
      >
        <Tabs.TabPane tab="Module" key="Module">
          <ModuleSelectionView
            setName={ setModuleName }
            setTimeSeries={ setTimeSeries }
            setSelected={ setSelected }
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Template" key="Template">
          <TemplateSelectionView
            dashboards={ props.dashboards }
            onSelectedDashboardTemplate={ setSelectedDashboardTemplate }
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

