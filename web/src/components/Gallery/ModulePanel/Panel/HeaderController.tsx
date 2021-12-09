/**
 * Created by Jacob Xie on 10/13/2020.
 */

import { useState, useEffect, useContext, useMemo } from "react"
import { Tooltip, Alert, Checkbox, Col, DatePicker, Modal, Row, Select, Space, message } from "antd"
import { FormattedMessage, useIntl } from "umi"
import moment from "moment"

import { DragButton, TimeSetButton, EditButton, DeleteButton, TimePickButton } from "./ControllerButtons"

import * as DataType from "../../GalleryDataType"
import _ from 'lodash'

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'
import e from "@umijs/deps/compiled/express"

//编辑时的head
interface TimeSetModalProps {
  intl: any
  show: boolean | undefined,
  visible: boolean,
  onOk: (isNew?: boolean) => void,
  onCancel: () => void,
  editDate: React.Dispatch<React.SetStateAction<string | undefined>>
  dateList: string[] | undefined
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>
}

const TimeSetModal = (props: TimeSetModalProps) => {
  const [isNew, setIsNew] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [date, setDate] = useState<any>(DataType.today())
  const NestedDedicatedProps = useContext(nestedDedicatedContext)

  //判断"yyyy-MM-DDTHH:mm:ss.SSS"格式的字符串是否在数组中
  function isTimeInArray(time: string, arr: string[] | undefined) {

    return arr?.includes(time)
  }

  //日期组件的时间变化回调
  //1.改变本组件的date
  //2.是否禁用下方的checkbox 
  const dateOnChange = (date: moment.Moment | null, dateStr: string) => {
    console.log(39, date, dateStr)
    if (date !== null) setDate(dateStr)
    isTimeInArray(dateStr, props.dateList)
      ? setIsDisabled(true) : setIsDisabled(false);

    console.log(45, dateStr, props.dateList)
  }

  //【确定】回调函数
  const onOk = () => {
    console.log(45, date)
    if (!isNew && !isTimeInArray(date, props.dateList)) {
      message.warn(`${date}该日期没有内容，请先创建`)
      return
    } else {

      props.onOk()
      props.setDate(date)
    }

    // 如果是新建内容，根据是否嵌套模块在前端更新dateList
    if (isNew) {
      if (NestedDedicatedProps?.setDateList) {
        NestedDedicatedProps.setDateList((dateList) => {
          if (Array.isArray(dateList)) {
            if (!dateList.includes(date)) {

              return [...new Set([...dateList, date])].sort((a: string, b: string) => a > b ? -1 : 1)
            }
          } else {
            return [date]
          }
        })
      }

    }

  }
  useEffect(() => {
    console.log(98, isDisabled)
  }, [isDisabled])
  console.log(96, props.dateList)
  //初始化设置：是否能新建当前日期的内容。
  useEffect(() => {
    console.log(102, moment().format('yyyy-MM-DD'), props.dateList)
    isTimeInArray(moment().format('yyyy-MM-DD'), props.dateList) ? setIsDisabled(true) : setIsDisabled(false)
  }, [props.dateList])

  return props.show ?
    <Modal
      title={props.intl.formatMessage({ id: "gallery.component.module-panel.panel.header-controller1" })}

      visible={props.visible}
      onOk={onOk}
      onCancel={props.onCancel}
    >
      <Space direction="vertical">
        <DatePicker
          onChange={dateOnChange}
          defaultValue={moment()}
        />
        <Checkbox
          disabled={isDisabled}
          onChange={e => setIsNew(e.target.checked)}>
          <FormattedMessage id="gallery.component.module-panel.panel.header-controller2" />
        </Checkbox>
        {
          isDisabled
            ? <Alert message='该日期已有内容，不可新建，只能修改' type='error'></Alert>
            : <></>
        }
      </Space>
    </Modal>
    : <></>
}


//无编辑时的head
interface TimePickModalProps {
  intl: any
  visible: boolean
  onOk: () => void
  onCancel: () => void
  dateList: string[]
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>
}
const TimePickModal = (props: TimePickModalProps) => {
  const [date, setDate] = useState<string>()

  const onChange = (d: string) => setDate(d)

  const onOk = () => {
    if (date) {
      props.setDate(date)
      props.onOk()
    }
  }

  return <Modal
    title={props.intl.formatMessage({ id: "gallery.component.module-panel.panel.header-controller1" })}
    visible={props.visible}
    onOk={onOk}
    onCancel={props.onCancel}
  >
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a date"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={(input, option) => {
        if (option) return option.children.indexOf(input) >= 0
        return false
      }}
    >
      {
        props.dateList.map(d =>
          <Select.Option value={d} key={d}>
            {DataType.timeToString(d)}
          </Select.Option>
        )
      }
    </Select>
  </Modal>
}











//主要组件
interface DateModalVisible {
  set: boolean
  pick: boolean
}

export interface HeaderController {
  editable: boolean
  settable: boolean
  timeSeries?: boolean
  dateList?: string[] | undefined
  editDate?: (date: string, isMessage?: boolean) => void
  editContent: (value: boolean) => void
  // newContent: (date: string) => void
  confirmDelete: () => void
  onSelectDate?: (date: string) => void
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>
  // updateContent: (content: DataType.Content) => void
  elementType: DataType.ElementType
  headName?: string

  content: DataType.Content
  setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>
}


// todo: current `HeaderController` is for `Dashboard`, need one for `Overview`
export const HeaderController = (props: HeaderController) => {
  const intl = useIntl()
  const [dateModalVisible, setDateModalVisible] = useState<DateModalVisible>({ set: false, pick: false })
  const [selectedDate, setSelectedDate] = useState<string>()
  // const isTemplate = useContext(IsTemplateContext)


  console.log(225, props.timeSeries, props.dateList)
  //日期Modal的【确认】回调
  const timeSetModalOnOk = (isNew?: boolean) => {
    // console.log(165, isNew, selectedDate)
    // if (props.editDate && selectedDate) {
    //     if (isNew) props.newContent(selectedDate)
    //     else {
    //         props.editDate(selectedDate, true)
    //     }
    // }

    setDateModalVisible({ ...dateModalVisible, set: false })
  }

  const timePickModalOnOk = () => {


    setDateModalVisible({ ...dateModalVisible, pick: false })
  }
  const NestedDedicatedProps = useContext(nestedDedicatedContext)

  //编辑时

  return props.editable
    ? (<Space>
      {console.log(251, props.timeSeries, props)}
      <DragButton />
      {/*allow user to edit content even if it's a template {isTemplate ? null : ( */}
      {true ?
        <>
          {/* 【日历】🗓️ */}
          {/* <TimeSetButton
                        show={props.timeSeries}
                        onClick={() => setDateModalVisible({ ...dateModalVisible, set: true })}
                    /> */}

          {/* 【小齿轮⚙️】 */}
          <EditButton
            editContent={props.editContent}
            timeSeries={props.timeSeries}
            elementType={props.elementType}
            headName={props.headName}

            content={props.content}
            setContent={props.setContent}
          />
        </> : <></>}
      {/* } */}
      {/* 【垃圾箱🗑️】 */}
      {
        !NestedDedicatedProps?.isNested
          ? <DeleteButton
            confirmDelete={props.confirmDelete} />
          : <></>
      }

      {/* 日历的modal */}
      {/* <TimeSetModal
                intl={intl}
                show={props.timeSeries}
                visible={dateModalVisible.set}
                onOk={timeSetModalOnOk}
                onCancel={() => setDateModalVisible({ ...dateModalVisible, set: false })}
                editDate={setSelectedDate}
                dateList={props.dateList}
                setDate={props.setDate}
            /> */}
    </Space>)
    : (<Row justify={'end'}>
      {console.log(2511, props.timeSeries, props)}
      <Col>
        {
          props.timeSeries && props.dateList ?
            <Space>
              {/* 【日历】🗓️  */}
              {/* <TimePickButton
                onClick={() =>
                  setDateModalVisible({ ...dateModalVisible, pick: true })}
              /> */}
              {/* 【日历】🗓️  */}
              {/* <TimePickModal
                intl={intl}
                visible={dateModalVisible.pick}
                onOk={timePickModalOnOk}
                onCancel={() => setDateModalVisible({ ...dateModalVisible, pick: false })}
                dateList={props.dateList}
                setDate={props.setDate}
              /> */}
            </Space> : <></>
        }
      </Col>
    </Row>)
}


