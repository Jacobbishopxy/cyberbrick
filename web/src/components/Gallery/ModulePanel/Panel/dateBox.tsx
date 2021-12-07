import { CloseOutlined } from '@ant-design/icons'
import styles from './Common.less'
import { useContext } from 'react'
import * as DataType from "../../GalleryDataType"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

import { DashboardContext } from "../../Dashboard/DashboardContext"
import e from "@umijs/deps/compiled/express"
interface dateBoxProps {
    date?: string
    setDate: React.Dispatch<React.SetStateAction<string>>
    style?: React.CSSProperties
    currDate: string
    elementName: string
}
export default (props: dateBoxProps) => {

    const dashboardProps = useContext(DashboardContext)
    const nestedDedicatedProps = useContext(nestedDedicatedContext)
    console.log(100, props.currDate, props.date)
    return (
        <div className={styles.dateBox}
            style={props.currDate === props.date ? {
                backgroundColor: 'rgba(111, 184, 226, 0.76)'
            } : {}}
            // 改变date
            onClick={() => props.setDate(props.date!)}>

            <CloseOutlined
                // 删除content和dateList
                onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                    console.log(1888, e)

                    e.stopPropagation()
                    if (dashboardProps?.setAllContent) {

                        dashboardProps?.setAllContent((allContent) => {
                            const newAllContent = allContent?.filter((v) => {
                                return !(v.date.slice(0, 10) === props.date?.slice(0, 10) && v.element?.name === props.elementName
                                )
                            })
                            console.log(411, newAllContent, props.date, props.elementName)
                            return newAllContent
                        })
                    }
                    if (nestedDedicatedProps?.setDateList) {
                        nestedDedicatedProps.setDateList((dateList) => dateList.filter((v) => v !== props.date))
                    }

                }}
                style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    cursor: 'pointer',
                }}
            />
            {props.date}
        </div>
    )
}