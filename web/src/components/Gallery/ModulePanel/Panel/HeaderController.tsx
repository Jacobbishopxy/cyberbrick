/**
 * Created by Jacob Xie on 10/13/2020.
 */

import { useState, useEffect } from "react"
import { Tooltip, Alert, Checkbox, Col, DatePicker, Modal, Row, Select, Space } from "antd"
import { FormattedMessage, useIntl } from "umi"
import moment from "moment"

import { DragButton, TimeSetButton, EditButton, DeleteButton, TimePickButton } from "./ControllerButtons"

import * as DataType from "../../GalleryDataType"


//编辑时的head
interface TimeSetModalProps {
    intl: any
    show: boolean | undefined,
    visible: boolean,
    onOk: (isNew?: boolean) => void,
    onCancel: () => void,
    editDate: React.Dispatch<React.SetStateAction<string | undefined>>
    dateList: string[] | undefined
    setDate: React.Dispatch<React.SetStateAction<string>>
}

const TimeSetModal = (props: TimeSetModalProps) => {
    const [isNew, setIsNew] = useState<boolean>(false)
    const [isCheckBox, setIsCheckBox] = useState<boolean>(false)
    const [date, setDate] = useState<any>(DataType.today())
    //判断"yyyy-MM-DDTHH:mm:ss.SSS"格式的字符串是否在数组中
    function isTimeInArray(time: string, arr: string[] | undefined) {
        const dateFormDB = DataType.dateToDBdate(time)
        return props.dateList?.includes(dateFormDB)
    }

    //日期组件的时间变化回调
    const dateOnChange = (date: moment.Moment | null, dateStr: string) => {
        const dateFormDB = DataType.dateToDBdate(dateStr)
        console.log(39, dateFormDB)
        if (date !== null) setDate(dateFormDB)
        isTimeInArray(dateStr, props.dateList)
            ? setIsCheckBox(true) : setIsCheckBox(false);

        console.log(45, isTimeInArray(dateStr, props.dateList))
    }

    const onOk = () => {
        console.log(45, date)
        props.onOk()
        // props.editDate(() => date)
        props.setDate(date)
    }
    //初始化设置：是否能新建当前日期的内容。
    useEffect(() => {
        isTimeInArray(moment().format('yyyy-MM-DD'), props.dateList) ? setIsCheckBox(true) : setIsCheckBox(false)
    }, [])

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
                    disabled={isCheckBox}
                    onChange={e => setIsNew(e.target.checked)}>
                    <FormattedMessage id="gallery.component.module-panel.panel.header-controller2" />
                </Checkbox>
                {
                    isCheckBox
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
    setDate: React.Dispatch<React.SetStateAction<string>>
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
    newContent: (date: string) => void
    confirmDelete: () => void
    onSelectDate?: (date: string) => void
    setTitle: React.Dispatch<React.SetStateAction<string | undefined>>
    updateContent: (content: DataType.Content) => void
    elementType: DataType.ElementType
    headName?: string

    content: DataType.Content
    setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
    setDate: React.Dispatch<React.SetStateAction<string>>
}


// todo: current `HeaderController` is for `Dashboard`, need one for `Overview`
export const HeaderController = (props: HeaderController) => {
    const intl = useIntl()
    const [dateModalVisible, setDateModalVisible] = useState<DateModalVisible>({ set: false, pick: false })
    const [selectedDate, setSelectedDate] = useState<string>()
    // const isTemplate = useContext(IsTemplateContext)



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


    //编辑时
    const editableController = () => {
        return (<Space>
            <DragButton />
            {/*allow user to edit content even if it's a template {isTemplate ? null : ( */}
            {true ?
                <>
                    {/* 【日历】🗓️ */}
                    <TimeSetButton
                        show={props.timeSeries}
                        onClick={() => setDateModalVisible({ ...dateModalVisible, set: true })}
                    />

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
            <DeleteButton
                confirmDelete={props.confirmDelete}
            />
            {/* 日历的modal */}
            <TimeSetModal
                intl={intl}
                show={props.timeSeries}
                visible={dateModalVisible.set}
                onOk={timeSetModalOnOk}
                onCancel={() => setDateModalVisible({ ...dateModalVisible, set: false })}
                editDate={setSelectedDate}
                dateList={props.dateList}
                setDate={props.setDate}
            />
        </Space>)
    }
    //无编辑时
    const nonEditableController = () => {
        console.log(159, props.dateList)
        return (
            <Row justify={'end'}>
                <Col>
                    {
                        props.timeSeries && props.dateList ?
                            <Space>
                                <TimePickButton
                                    onClick={() =>
                                        setDateModalVisible({ ...dateModalVisible, pick: true })}
                                />
                                <TimePickModal
                                    intl={intl}
                                    visible={dateModalVisible.pick}
                                    onOk={timePickModalOnOk}
                                    onCancel={() => setDateModalVisible({ ...dateModalVisible, pick: false })}
                                    dateList={props.dateList}
                                    setDate={props.setDate}
                                />
                            </Space> : <></>
                    }
                </Col>
            </Row>

        )
    }
    const genController = () =>
        props.editable ? editableController() : nonEditableController()


    return genController()
}

