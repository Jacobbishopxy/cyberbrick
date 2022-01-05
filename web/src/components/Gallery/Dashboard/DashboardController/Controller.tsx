/**
 * Created by Jacob Xie on 9/24/2020.
 */

import { useEffect, useMemo, useState, useContext } from "react"
import { Button, message, Modal, Space } from "antd"
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  PoweroffOutlined,
  SettingOutlined
} from "@ant-design/icons"
import { FormattedMessage, useIntl } from "umi"

import { SpaceBetween } from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"
import { SelectorPanel } from "./SelectorPanel"
import { AddModuleModal } from "./AddModuleModal"
import { DashboardContext } from '../DashboardContext'
import { ContainerRef } from "../DashboardContainer/Container"
export interface ModuleControllerProps {
  initialSelected?: string[]
  onSelectChange?: (v: string[]) => void
  canEdit: boolean
  categoriesAllType: DataType.Category[]
  dashboardCategories: DataType.Category[]
  categoryOnSelect: (categoryName: string, isCopy: boolean) => Promise<DataType.Category>
  dashboardOnSelect: (id: string, isCopy: boolean) => Promise<DataType.Dashboard>
  onAddModule: (name: string, timeSeries: boolean, value: DataType.ElementType) => void
  onCopyTemplate: (originTemplateId: string) => void
  edit: boolean
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  onSaveTemplate: (shouldSaveTemplateAndContents: boolean) => Promise<void>
  ContainerRef: React.Ref<ContainerRef>
  setSelectedCategoryName: (s: string) => void
}

export const Controller = (props: ModuleControllerProps) => {
  const intl = useIntl()
  const dashboardContextProps = useContext(DashboardContext)
  // const [edit, setEdit] = useState<boolean>(props.edit)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)

  // useEffect(() => {
  //     console.log(42, edit)
  //     props.onEditTemplate(() => edit)
  // }, [edit])



  useEffect(() => {
    if (props.initialSelected && props.initialSelected[1])
      props.dashboardOnSelect(props.initialSelected[1], false).finally()
  }, [props.initialSelected])

  const quitAddModule = () => {
    setAddModuleModalVisible(false)
    console.log(55555)
  }

  //模板保存&退出事件。
  const saveOrExitTemplate = (isSave: boolean) =>
    () => {

      //exit: set edit to false; save: set edit to true and allow further edition.
      // Exit:设置edit为false; 保存:设置edit为true并允许进一步编辑。  
      // const quit = () => isSave ? props.setEdit(false) : undefined
      if (isSave) {
        console.log(6363, props.ContainerRef?.current.elements)
        for (let i = 0; i < props.ContainerRef?.current.elements.length; i++) {
          const el = props.ContainerRef?.current.elements[i]

          if (el.edit === true) {
            message.warn('部分模块处于编辑状态，不允许保存')
            return
          }

        }
        // props.ContainerRef?.current.elements.forEach((el) => {
        //   if (el.type === DataType.ElementType.Excel) {

        //     if (el.edit === true) {
        //       message.warn('部分模块处于编辑状态，不允许保存')
        //       return 
        //     }
        //   }
        // })
      }
      return Modal.confirm({
        title: isSave
          ? intl.formatMessage({ id: "gallery.component.dashboard-controller1" })
          : intl.formatMessage({ id: "gallery.component.dashboard-controller2" }),
        icon: <ExclamationCircleOutlined />,
        onOk: () => {
          props.onSaveTemplate(isSave).then(() => {
            isSave
              ? message.success(intl.formatMessage({ id: "gallery.component.dashboard-controller3" }))
              : message.success(intl.formatMessage({ id: "gallery.component.dashboard-controller4" }))


            // 清空allContent和allElement和contentIds
            if (dashboardContextProps?.setAllContent) {

              dashboardContextProps?.setAllContent(() => [])
            }
            if (dashboardContextProps?.ContainerRef && dashboardContextProps.ContainerRef.current) {
              dashboardContextProps.ContainerRef.current.setElements(() => [])
            }
            dashboardContextProps?.setContentIdsToBeDelect(() => [])

            props.setEdit(false)
          })
            .catch(err => {
              message.error(`Error: ${err}`)
              props.setEdit(true)
            })
        },
        onCancel: () => {
          // isSave && props.onSaveTemplate(false).then(quit)
        },
      })


    }

  const editMode = useMemo(() => (
    <>
      <Space>
        {/* 新建 */}
        <Button
          type="primary"
          size="small"
          onClick={() => setAddModuleModalVisible(true)}
        >
          <PlusCircleOutlined />
          <FormattedMessage id="gallery.component.general10" />
        </Button>
        {/* 保存 */}
        <Button
          type="primary"
          size="small"
          onClick={saveOrExitTemplate(true)}
        >
          <CheckCircleOutlined />
          <FormattedMessage id="gallery.component.general11" />
        </Button>
        {/* 退出 */}
        <Button
          size="small"
          danger
          onClick={saveOrExitTemplate(false)}
        >
          <PoweroffOutlined />
          <FormattedMessage id="gallery.component.general12" />
        </Button>

      </Space>
      <AddModuleModal
        onAddModule={props.onAddModule}
        categories={props.categoriesAllType}
        categoryOnSelect={name => props.categoryOnSelect(name, true)}
        dashboardOnSelect={id => props.dashboardOnSelect(id, true)}
        copyTemplate={props.onCopyTemplate}
        visible={addModuleModalVisible}
        onQuit={quitAddModule}
      // saveOrExitTemplate={saveOrExitTemplate(true)}
      />
    </>
  ), [addModuleModalVisible, props.onSaveTemplate])

  //使能状态
  const idleMode = useMemo(() => (
    <Button
      type="primary"
      size="small"
      onClick={() => props.setEdit(true)}
      disabled={!props.canEdit}
    >
      <SettingOutlined />
      <FormattedMessage id="gallery.component.general14" />
    </Button>
  ), [props.canEdit])

  return (
    <SpaceBetween>
      {/* 左边的公司select */}
      <SelectorPanel
        initValue={props.initialSelected}
        isMainController={true}
        categories={props.dashboardCategories}
        categoryOnSelect={name => props.categoryOnSelect(name, false)}
        onSelectFinish={id => props.dashboardOnSelect(id, false)}
        onChange={props.onSelectChange}
        setSelectedCategoryName={props.setSelectedCategoryName}
        size="small"
      />

      {/* 右边的编辑 */}
      <div style={{
        position: 'fixed',
        right: '50px',
        top: '70px',
        zIndex: 10
      }}>
        {props.edit ? editMode : idleMode}
      </div>
    </SpaceBetween>
  )
}

Controller.defaultProps = {
  markAvailable: false
} as Partial<ModuleControllerProps>

