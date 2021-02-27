/**
 * Created by Jacob Xie on 10/13/2020.
 */

import {useState} from "react"
import {Checkbox, DatePicker, Modal, Select, Space} from "antd"
import {FormattedMessage, useIntl} from "umi"
import moment from "moment"

import {DragButton, TimeSetButton, EditButton, DeleteButton, TimePickButton} from "./ControllerButtons"

interface TimeSetModalProps {
  intl: any
  show: boolean | undefined,
  visible: boolean,
  onOk: (isNew: boolean) => void,
  onCancel: () => void,
  editDate: (date: string) => void
}

const TimeSetModal = (props: TimeSetModalProps) => {
  const [isNew, setIsNew] = useState<boolean>(false)

  const dateOnChange = (date: moment.Moment | null, dateStr: string) => {
    if (date !== null) props.editDate(dateStr)
  }

  const onOk = () => props.onOk(isNew)

  return props.show ?
    <Modal
      title={props.intl.formatMessage({id: "gallery.component.module-panel.panel.header-controller1"})}
      visible={props.visible}
      onOk={onOk}
      onCancel={props.onCancel}
    >
      <Space direction="vertical">
        <DatePicker
          onChange={dateOnChange}
          defaultValue={moment()}
        />
        <Checkbox onChange={e => setIsNew(e.target.checked)}>
          <FormattedMessage id="gallery.component.module-panel.panel.header-controller2"/>
        </Checkbox>
      </Space>
    </Modal> : <></>
}

interface TimePickModalProps {
  intl: any
  visible: boolean
  onOk: (date: string) => void
  onCancel: () => void
  dateList: string[]
}

const TimePickModal = (props: TimePickModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string>()

  const onChange = (d: string) => setSelectedDate(d)

  const onOk = () => {
    if (selectedDate) props.onOk(selectedDate)
  }

  return <Modal
    title={props.intl.formatMessage({id: "gallery.component.module-panel.panel.header-controller1"})}
    visible={props.visible}
    onOk={onOk}
    onCancel={props.onCancel}
  >
    <Select
      showSearch
      style={{width: 200}}
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
          <Select.Option value={d} key={d}>{d}</Select.Option>
        )
      }
    </Select>
  </Modal>
}

interface DateModalVisible {
  set: boolean
  pick: boolean
}

export interface HeaderController {
  editable: boolean
  settable: boolean
  timeSeries?: boolean
  dateList?: string[]
  editDate?: (date: string) => void
  editContent: (value: boolean) => void
  newContent: (date: string) => void
  confirmDelete: () => void
  onSelectDate?: (date: string) => void
}

// todo: current `HeaderController` is for `Dashboard`, need one for `Overview`
export const HeaderController = (props: HeaderController) => {
  const intl = useIntl()
  const [dateModalVisible, setDateModalVisible] = useState<DateModalVisible>({set: false, pick: false})
  const [selectedDate, setSelectedDate] = useState<string>()

  const timeSetModalOnOk = (isNew: boolean) => {
    if (props.editDate && selectedDate) {
      if (isNew) props.newContent(selectedDate)
      else props.editDate(selectedDate)
    }
    setDateModalVisible({...dateModalVisible, set: false})
  }

  const timePickModalOnOk = (date: string) => {
    if (props.onSelectDate) props.onSelectDate(date)
    setDateModalVisible({...dateModalVisible, pick: false})
  }

  const editableController = () =>
    <Space>
      <DragButton/>
      {
        props.settable ?
          <>
            <TimeSetButton
              show={props.timeSeries}
              onClick={() => setDateModalVisible({...dateModalVisible, set: true})}
            />
            <EditButton editContent={props.editContent}/>
          </> : <></>
      }
      <DeleteButton
        confirmDelete={props.confirmDelete}
      />
      <TimeSetModal
        intl={intl}
        show={props.timeSeries}
        visible={dateModalVisible.set}
        onOk={timeSetModalOnOk}
        onCancel={() => setDateModalVisible({...dateModalVisible, set: false})}
        editDate={setSelectedDate}
      />
    </Space>

  const nonEditableController = () =>
    props.timeSeries && props.dateList ?
      <Space>
        <TimePickButton
          onClick={() => setDateModalVisible({...dateModalVisible, pick: true})}
        />
        <TimePickModal
          intl={intl}
          visible={dateModalVisible.pick}
          onOk={timePickModalOnOk}
          onCancel={() => setDateModalVisible({...dateModalVisible, pick: false})}
          dateList={props.dateList}
        />
      </Space> : <></>

  const genController = () =>
    props.editable ? editableController() : nonEditableController()


  return genController()
}

